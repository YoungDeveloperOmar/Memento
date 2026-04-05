import { createServer } from "node:http";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");
const dataDirectory = join(projectRoot, "data");
const databasePath = join(dataDirectory, "memento.sqlite");
const distDirectory = join(projectRoot, "dist");
const isDevMode = process.argv.includes("--dev");
const port = Number(process.env.PORT ?? 3001);

const loadEnvFile = (filePath) => {
  if (!existsSync(filePath)) {
    return;
  }

  const fileContents = readFileSync(filePath, "utf8");

  for (const rawLine of fileContents.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^(['"])(.*)\1$/u, "$2");

    const currentValue = process.env[key];

    if (!key || (typeof currentValue === "string" && currentValue.trim())) {
      continue;
    }

    process.env[key] = value;
  }
};

loadEnvFile(join(projectRoot, ".env"));
loadEnvFile(join(projectRoot, ".env.local"));

const openAiApiKey = process.env.OPENAI_API_KEY?.trim() ?? "";
const openAiBaseUrl = (process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1").replace(/\/$/, "");
const openAiModel = process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini";

mkdirSync(dataDirectory, { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec("PRAGMA foreign_keys = ON;");
database.exec(`
  CREATE TABLE IF NOT EXISTS caregivers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    caregiver_id TEXT NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
    patient_login_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    support_level TEXT NOT NULL,
    daily_summary TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS patient_profiles (
    patient_id TEXT PRIMARY KEY REFERENCES patients(id) ON DELETE CASCADE,
    identity_summary TEXT NOT NULL DEFAULT '',
    important_people TEXT NOT NULL DEFAULT '',
    preferences TEXT NOT NULL DEFAULT '',
    comfort_notes TEXT NOT NULL DEFAULT '',
    life_story TEXT NOT NULL DEFAULT '',
    assistant_brief TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS medications (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    instructions TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    completed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    relationship TEXT NOT NULL,
    is_primary INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS routine_tasks (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    scheduled_time TEXT NOT NULL,
    status TEXT NOT NULL,
    source TEXT NOT NULL,
    created_at TEXT NOT NULL,
    completed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    caregiver_id TEXT NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS assistant_messages (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS care_note_messages (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS emergency_alerts (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    triggered_by_role TEXT NOT NULL,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS support_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const patientColumns = database.prepare("PRAGMA table_info(patients)").all();

if (!patientColumns.some((column) => column.name === "dementia_classification")) {
  database.exec(
    "ALTER TABLE patients ADD COLUMN dementia_classification TEXT NOT NULL DEFAULT 'other'",
  );
}

const now = () => new Date().toISOString();

const createId = (prefix) => `${prefix}_${randomBytes(6).toString("hex")}`;

const normalizeEmail = (email) => email.trim().toLowerCase();

const jsonHeaders = {
  "Content-Type": "application/json",
};

const staticContentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, jsonHeaders);
  response.end(JSON.stringify(payload));
};

const sendError = (response, statusCode, message) => {
  sendJson(response, statusCode, { message });
};

const readBody = async (request) => {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const matchPath = (pathname, template) => {
  const pathSegments = pathname.split("/").filter(Boolean);
  const templateSegments = template.split("/").filter(Boolean);

  if (pathSegments.length !== templateSegments.length) {
    return null;
  }

  const params = {};

  for (let index = 0; index < templateSegments.length; index += 1) {
    const templateSegment = templateSegments[index];
    const pathSegment = pathSegments[index];

    if (templateSegment.startsWith(":")) {
      params[templateSegment.slice(1)] = decodeURIComponent(pathSegment);
      continue;
    }

    if (templateSegment !== pathSegment) {
      return null;
    }
  }

  return params;
};

const hashPassword = (password) => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, key] = storedHash.split(":");
  const derivedKey = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(key, "hex");
  return timingSafeEqual(derivedKey, storedBuffer);
};

const dementiaClassificationLabels = {
  "alzheimers-disease": "Alzheimer's disease",
  "vascular-dementia": "Vascular dementia",
  "lewy-body-dementia": "Lewy body dementia",
  "frontotemporal-dementia": "Frontotemporal dementia",
  "mixed-dementia": "Mixed dementia",
  other: "Other or unspecified dementia",
};

const normalizeDementiaClassification = (classification) =>
  dementiaClassificationLabels[classification] ? classification : "other";

const buildAssistantBrief = (name, dementiaClassification, profile) => {
  const segments = [
    `Your name is ${name}.`,
    `Your caregiver has recorded your dementia classification as ${
      dementiaClassificationLabels[normalizeDementiaClassification(dementiaClassification)]
    }.`,
    profile.identitySummary ? `About you: ${profile.identitySummary}` : "",
    profile.importantPeople ? `Important people in your life: ${profile.importantPeople}` : "",
    profile.preferences ? `Preferences: ${profile.preferences}` : "",
    profile.comfortNotes ? `Comfort and support notes: ${profile.comfortNotes}` : "",
    profile.lifeStory ? `Life story notes: ${profile.lifeStory}` : "",
  ];

  return segments.filter(Boolean).join(" ");
};

const buildPatientContext = (patientBundle) => {
  const routineLines = patientBundle.routine.tasks.length
    ? patientBundle.routine.tasks
        .map((task) => `${task.title} at ${task.scheduledTime}${task.description ? ` (${task.description})` : ""}`)
        .join("; ")
    : "No routine tasks are currently scheduled.";

  const medicationLines = patientBundle.medications.length
    ? patientBundle.medications
        .map(
          (medication) =>
            `${medication.name} ${medication.dosage} at ${medication.scheduledTime} (${medication.instructions})`,
        )
        .join("; ")
    : "No medications are currently scheduled.";

  const contactLines = patientBundle.contacts.length
    ? patientBundle.contacts
        .map((contact) => `${contact.name}, ${contact.relationship}, ${contact.phone}`)
        .join("; ")
    : "No emergency contacts are listed.";

  return [
    `Patient name: ${patientBundle.patient.name}`,
    `Support level: ${patientBundle.patient.supportLevel}`,
    `Dementia classification: ${dementiaClassificationLabels[patientBundle.patient.dementiaClassification]}`,
    patientBundle.profile.identitySummary
      ? `Identity summary: ${patientBundle.profile.identitySummary}`
      : "Identity summary: not provided.",
    patientBundle.profile.importantPeople
      ? `Important people: ${patientBundle.profile.importantPeople}`
      : "Important people: not provided.",
    patientBundle.profile.preferences
      ? `Preferences: ${patientBundle.profile.preferences}`
      : "Preferences: not provided.",
    patientBundle.profile.comfortNotes
      ? `Comfort notes: ${patientBundle.profile.comfortNotes}`
      : "Comfort notes: not provided.",
    patientBundle.profile.lifeStory
      ? `Life story notes: ${patientBundle.profile.lifeStory}`
      : "Life story notes: not provided.",
    `Routine: ${routineLines}`,
    `Medications: ${medicationLines}`,
    `Emergency contacts: ${contactLines}`,
    patientBundle.patient.dailySummary
      ? `Current daily summary: ${patientBundle.patient.dailySummary}`
      : "Current daily summary: not provided.",
  ].join("\n");
};

const extractResponseText = (payload) => {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const output = Array.isArray(payload?.output) ? payload.output : [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];

    for (const part of content) {
      if (part?.type === "output_text" && typeof part.text === "string" && part.text.trim()) {
        return part.text.trim();
      }
    }
  }

  return "";
};

const createOpenAiTextResponse = async ({ instructions, input, maxOutputTokens = 350 }) => {
  if (!openAiApiKey) {
    return "";
  }

  const response = await fetch(`${openAiBaseUrl}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({
      model: openAiModel,
      instructions,
      input,
      max_output_tokens: maxOutputTokens,
      reasoning: {
        effort: "low",
      },
      text: {
        format: {
          type: "text",
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "The OpenAI request failed.");
  }

  const payload = await response.json();
  return extractResponseText(payload);
};

const createSetupMessage = () =>
  "AI is not configured yet. Add OPENAI_API_KEY to .env.local in the project root, restart the server, and try again.";

const createAssistantErrorMessage = () =>
  "I’m having trouble reaching the AI service right now. Please ask your caregiver to check the server logs and try again.";

const buildConversationTranscript = (messages, speakerLabels) => {
  if (!messages.length) {
    return "Conversation so far: none.";
  }

  const transcript = messages
    .map((entry) => `${speakerLabels[entry.sender] ?? entry.sender}: ${entry.content}`)
    .join("\n");

  return `Conversation so far:\n${transcript}`;
};

const generatePatientLoginId = () => {
  const statement = database.prepare("SELECT id FROM patients WHERE patient_login_id = ?");

  while (true) {
    const candidate = `MEM-${randomBytes(3).toString("hex").toUpperCase()}`;

    if (!statement.get(candidate)) {
      return candidate;
    }
  }
};

const getCaregiverRow = (caregiverId) =>
  database.prepare("SELECT * FROM caregivers WHERE id = ?").get(caregiverId);

const getPatientRow = (patientId) =>
  database.prepare("SELECT * FROM patients WHERE id = ?").get(patientId);

const getPatientRowByLoginId = (patientLoginId) =>
  database.prepare("SELECT * FROM patients WHERE patient_login_id = ?").get(patientLoginId);

const mapCaregiver = (row) => {
  const patientRows = database
    .prepare("SELECT id FROM patients WHERE caregiver_id = ? ORDER BY created_at ASC")
    .all(row.id);

  return {
    id: row.id,
    role: "caregiver",
    name: row.name,
    email: row.email,
    patientIds: patientRows.map((patient) => patient.id),
    createdAt: row.created_at,
  };
};

const mapPatient = (row) => ({
  id: row.id,
  role: "patient",
  caregiverId: row.caregiver_id,
  patientLoginId: row.patient_login_id,
  name: row.name,
  supportLevel: row.support_level,
  dementiaClassification: normalizeDementiaClassification(row.dementia_classification),
  dailySummary: row.daily_summary,
  createdAt: row.created_at,
});

const buildRoutine = (patientId, createdAt) => ({
  id: `routine_${patientId}`,
  patientId,
  title: "Daily Routine",
  description: "Shared daily routine items from the caregiver and patient.",
  tasks: database
    .prepare("SELECT * FROM routine_tasks WHERE patient_id = ? ORDER BY scheduled_time ASC, created_at ASC")
    .all(patientId)
    .map((task) => ({
      id: task.id,
      patientId: task.patient_id,
      title: task.title,
      description: task.description,
      scheduledTime: task.scheduled_time,
      status: task.status,
      source: task.source,
      createdAt: task.created_at,
      completedAt: task.completed_at ?? undefined,
    })),
  createdAt,
});

const buildPatientBundle = (patientId) => {
  const patientRow = getPatientRow(patientId);

  if (!patientRow) {
    return null;
  }

  const caregiverRow = getCaregiverRow(patientRow.caregiver_id);
  const profileRow =
    database.prepare("SELECT * FROM patient_profiles WHERE patient_id = ?").get(patientId) ?? {};

  return {
    caregiver: {
      id: caregiverRow.id,
      name: caregiverRow.name,
      email: caregiverRow.email,
    },
    patient: mapPatient(patientRow),
    profile: {
      patientId,
      identitySummary: profileRow.identity_summary ?? "",
      importantPeople: profileRow.important_people ?? "",
      preferences: profileRow.preferences ?? "",
      comfortNotes: profileRow.comfort_notes ?? "",
      lifeStory: profileRow.life_story ?? "",
      assistantBrief: profileRow.assistant_brief ?? "",
      updatedAt: profileRow.updated_at ?? patientRow.updated_at,
    },
    medications: database
      .prepare("SELECT * FROM medications WHERE patient_id = ? ORDER BY scheduled_time ASC, created_at ASC")
      .all(patientId)
      .map((medication) => ({
        id: medication.id,
        patientId: medication.patient_id,
        name: medication.name,
        dosage: medication.dosage,
        instructions: medication.instructions,
        scheduledTime: medication.scheduled_time,
        status: medication.status,
        createdAt: medication.created_at,
        completedAt: medication.completed_at ?? undefined,
      })),
    contacts: database
      .prepare("SELECT * FROM contacts WHERE patient_id = ? ORDER BY is_primary DESC, created_at ASC")
      .all(patientId)
      .map((contact) => ({
        id: contact.id,
        patientId: contact.patient_id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
        isPrimary: Boolean(contact.is_primary),
        createdAt: contact.created_at,
      })),
    routine: buildRoutine(patientId, patientRow.created_at),
    emergencyAlerts: database
      .prepare("SELECT * FROM emergency_alerts WHERE patient_id = ? ORDER BY created_at DESC")
      .all(patientId)
      .map((alert) => ({
        id: alert.id,
        patientId: alert.patient_id,
        triggeredByRole: alert.triggered_by_role,
        createdAt: alert.created_at,
        status: alert.status,
      })),
    assistantMessages: database
      .prepare("SELECT * FROM assistant_messages WHERE patient_id = ? ORDER BY created_at ASC")
      .all(patientId)
      .map((message) => ({
        id: message.id,
        patientId: message.patient_id,
        sender: message.sender,
        content: message.content,
        createdAt: message.created_at,
      })),
    careNoteMessages: database
      .prepare("SELECT * FROM care_note_messages WHERE patient_id = ? ORDER BY created_at ASC")
      .all(patientId)
      .map((message) => ({
        id: message.id,
        patientId: message.patient_id,
        sender: message.sender,
        content: message.content,
        createdAt: message.created_at,
      })),
  };
};

const buildCaregiverDashboard = (caregiverId) => {
  const caregiverRow = getCaregiverRow(caregiverId);

  if (!caregiverRow) {
    return null;
  }

  return {
    caregiver: mapCaregiver(caregiverRow),
    patients: database
      .prepare("SELECT * FROM patients WHERE caregiver_id = ? ORDER BY created_at ASC")
      .all(caregiverId)
      .map(mapPatient),
    notifications: database
      .prepare("SELECT * FROM notifications WHERE caregiver_id = ? ORDER BY created_at DESC LIMIT 25")
      .all(caregiverId)
      .map((notification) => ({
        id: notification.id,
        caregiverId: notification.caregiver_id,
        patientId: notification.patient_id,
        type: notification.type,
        message: notification.message,
        createdAt: notification.created_at,
        isRead: Boolean(notification.is_read),
      })),
  };
};

const createNotification = (caregiverId, patientId, type, message) => {
  database
    .prepare(
      "INSERT INTO notifications (id, caregiver_id, patient_id, type, message, created_at, is_read) VALUES (?, ?, ?, ?, ?, ?, 0)",
    )
    .run(createId("notification"), caregiverId, patientId, type, message, now());
};

const createFallbackAssistantReply = (patientBundle, message) => {
  const normalizedMessage = message.trim().toLowerCase();
  const taskLines = patientBundle.routine.tasks
    .slice(0, 5)
    .map((task) => `${task.title} at ${task.scheduledTime}`)
    .join(", ");
  const medicationLines = patientBundle.medications
    .slice(0, 5)
    .map((medication) => `${medication.name} at ${medication.scheduledTime}`)
    .join(", ");

  if (normalizedMessage.includes("who am i") || normalizedMessage.includes("what is my name")) {
    return patientBundle.profile.assistantBrief || `Your name is ${patientBundle.patient.name}.`;
  }

  if (normalizedMessage.includes("family") || normalizedMessage.includes("close to") || normalizedMessage.includes("important people")) {
    return patientBundle.profile.importantPeople
      ? `Important people in your life: ${patientBundle.profile.importantPeople}`
      : "Your caregiver has not added important people yet.";
  }

  if (normalizedMessage.includes("today") || normalizedMessage.includes("routine") || normalizedMessage.includes("task")) {
    return taskLines
      ? `Today you have: ${taskLines}.`
      : "There are no routine tasks scheduled yet.";
  }

  if (normalizedMessage.includes("medicine") || normalizedMessage.includes("medication")) {
    return medicationLines
      ? `Your medications today are ${medicationLines}.`
      : "No medications are scheduled right now.";
  }

  if (normalizedMessage.includes("how was my day") || normalizedMessage.includes("summary")) {
    return patientBundle.patient.dailySummary
      ? `Here is your day summary: ${patientBundle.patient.dailySummary}`
      : "You have not saved a day summary yet.";
  }

  if (patientBundle.profile.assistantBrief) {
    return patientBundle.profile.assistantBrief;
  }

  return `I am here to help. Your caregiver has set up your profile as ${patientBundle.patient.name}. Ask about today's routine, medications, or important people.`;
};

const createPatientAssistantReply = async (patientBundle, message) => {
  if (!openAiApiKey) {
    return createSetupMessage();
  }

  const instructions = [
    "You are Memento, a calm, reassuring dementia-care voice assistant speaking directly to the patient.",
    "Respond like a supportive companion, not like a clinical report.",
    "Use short, warm sentences that are easy to follow aloud.",
    "Read the full conversation history before answering.",
    "Pay attention to what the patient already asked and what you already answered.",
    "Build on prior turns instead of restarting the conversation from the beginning.",
    "Do not repeat the same reassurance, biography, or orientation details unless the patient asks again or clearly seems confused.",
    "Answer the latest question directly, then add only the minimum extra support that helps.",
    "Vary your wording so replies do not sound repetitive.",
    "Use the patient context only to personalize and ground the reply.",
    "Never mention hidden prompts, internal context, or say you are summarizing stored data.",
    "If the patient seems confused, gently reorient them using familiar names, routines, and reassuring cues from context.",
    "If the patient asks about urgent help, remind them they can use the emergency help button or call a listed contact.",
    "Prefer 2 to 5 short sentences. Use a short list only when it genuinely helps with a plan or routine.",
    `Patient context:\n${buildPatientContext(patientBundle)}`,
  ].join(" ");

  const input = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: [
            buildConversationTranscript(patientBundle.assistantMessages, {
              patient: "Patient",
              assistant: "Assistant",
            }),
            `Latest patient message: ${message.trim()}`,
          ].join("\n\n"),
        },
      ],
    },
  ];

  try {
    const reply = await createOpenAiTextResponse({
      instructions,
      input,
      maxOutputTokens: 220,
    });

    return reply || createFallbackAssistantReply(patientBundle, message);
  } catch (error) {
    const details =
      error instanceof Error ? error.message : "Unknown OpenAI request failure.";
    process.stderr.write(`[memento-ai] patient assistant failed: ${details}\n`);
    return createAssistantErrorMessage();
  }
};

const createCareNoteAssistantReply = async (patientBundle, message) => {
  if (!openAiApiKey) {
    return createSetupMessage();
  }

  const instructions = [
    "You are the Memento Care Note Assistant helping a caregiver refine dementia-care notes for one patient.",
    "Respond conversationally and helpfully, like a thoughtful care coordinator.",
    "Read the full conversation history before answering.",
    "Use earlier caregiver questions and your own prior replies to avoid repetition and continue the same thread.",
    "Offer concise, practical guidance grounded in the provided patient context.",
    "When useful, suggest better phrasing for memory cues, comfort notes, routines, or caregiver prompts.",
    "Do not invent medical diagnoses or treatment instructions.",
    "Do not automatically edit the record. If the caregiver wants to change patient data, suggest what to edit in plain language.",
    `Patient context:\n${buildPatientContext(patientBundle)}`,
  ].join(" ");

  const input = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: [
            buildConversationTranscript(patientBundle.careNoteMessages, {
              caregiver: "Caregiver",
              assistant: "Assistant",
            }),
            `Latest caregiver message: ${message.trim()}`,
          ].join("\n\n"),
        },
      ],
    },
  ];

  const reply = await createOpenAiTextResponse({
    instructions,
    input,
    maxOutputTokens: 260,
  }).catch((error) => {
    const details =
      error instanceof Error ? error.message : "Unknown OpenAI request failure.";
    process.stderr.write(`[memento-ai] care note assistant failed: ${details}\n`);
    return "";
  });

  return reply || createAssistantErrorMessage();
};

const serveStaticFile = (request, response) => {
  if (!existsSync(distDirectory)) {
    sendError(response, 404, "The frontend build is not available.");
    return;
  }

  const requestPath = request.url === "/" ? "/index.html" : new URL(request.url, "http://localhost").pathname;
  const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = join(distDirectory, normalizedPath.replace(/^\/+/, ""));
  const fallbackPath = join(distDirectory, "index.html");
  const resolvedPath = existsSync(filePath) && statSync(filePath).isFile() ? filePath : fallbackPath;
  const extension = extname(resolvedPath);
  const contentType = staticContentTypes[extension] ?? "application/octet-stream";

  response.writeHead(200, { "Content-Type": contentType });
  response.end(readFileSync(resolvedPath));
};

const handleRequest = async (request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);

  if (request.method === "POST" && pathname === "/api/contact") {
    const body = await readBody(request);

    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      sendError(response, 400, "Name, email, and message are required.");
      return;
    }

    database
      .prepare("INSERT INTO support_messages (id, name, email, message, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(createId("support"), body.name.trim(), normalizeEmail(body.email), body.message.trim(), now());

    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/caregiver/register") {
    const body = await readBody(request);

    if (!body.fullName?.trim() || !body.email?.trim() || !body.password?.trim()) {
      sendError(response, 400, "Full name, email, and password are required.");
      return;
    }

    const email = normalizeEmail(body.email);

    if (database.prepare("SELECT id FROM caregivers WHERE email = ?").get(email)) {
      sendError(response, 409, "A caregiver account already exists with this email.");
      return;
    }

    const caregiverId = createId("caregiver");
    database
      .prepare("INSERT INTO caregivers (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(caregiverId, body.fullName.trim(), email, hashPassword(body.password), now());

    sendJson(response, 201, buildCaregiverDashboard(caregiverId));
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/caregiver/login") {
    const body = await readBody(request);

    if (!body.email?.trim() || !body.password?.trim()) {
      sendError(response, 400, "Email and password are required.");
      return;
    }

    const caregiverRow = database
      .prepare("SELECT * FROM caregivers WHERE email = ?")
      .get(normalizeEmail(body.email));

    if (!caregiverRow || !verifyPassword(body.password, caregiverRow.password_hash)) {
      sendError(response, 401, "Invalid email or password.");
      return;
    }

    sendJson(response, 200, buildCaregiverDashboard(caregiverRow.id));
    return;
  }

  if (request.method === "POST" && pathname === "/api/auth/patient/login") {
    const body = await readBody(request);

    if (!body.patientLoginId?.trim()) {
      sendError(response, 400, "Patient ID is required.");
      return;
    }

    const patientRow = getPatientRowByLoginId(body.patientLoginId.trim().toUpperCase());

    if (!patientRow) {
      sendError(response, 404, "No patient was found for that ID.");
      return;
    }

    sendJson(response, 200, buildPatientBundle(patientRow.id));
    return;
  }

  const caregiverDashboardParams = matchPath(pathname, "/api/caregivers/:caregiverId/dashboard");
  if (request.method === "GET" && caregiverDashboardParams) {
    const dashboard = buildCaregiverDashboard(caregiverDashboardParams.caregiverId);

    if (!dashboard) {
      sendError(response, 404, "Caregiver not found.");
      return;
    }

    sendJson(response, 200, dashboard);
    return;
  }

  const patientDashboardParams = matchPath(pathname, "/api/patients/:patientId/dashboard");
  if (request.method === "GET" && patientDashboardParams) {
    const bundle = buildPatientBundle(patientDashboardParams.patientId);

    if (!bundle) {
      sendError(response, 404, "Patient not found.");
      return;
    }

    sendJson(response, 200, bundle);
    return;
  }

  const createPatientParams = matchPath(pathname, "/api/caregivers/:caregiverId/patients");
  if (request.method === "POST" && createPatientParams) {
    const body = await readBody(request);

    if (!body.name?.trim()) {
      sendError(response, 400, "Patient name is required.");
      return;
    }

    const caregiverRow = getCaregiverRow(createPatientParams.caregiverId);

    if (!caregiverRow) {
      sendError(response, 404, "Caregiver not found.");
      return;
    }

    const patientId = createId("patient");
    const createdAt = now();
    const patientLoginId = generatePatientLoginId();
    const supportLevel = body.supportLevel ?? "early";
    const dementiaClassification = normalizeDementiaClassification(body.dementiaClassification);
    const profile = {
      identitySummary: body.identitySummary?.trim() ?? "",
      importantPeople: body.importantPeople?.trim() ?? "",
      preferences: body.preferences?.trim() ?? "",
      comfortNotes: body.comfortNotes?.trim() ?? "",
      lifeStory: body.lifeStory?.trim() ?? "",
    };
    const assistantBrief = buildAssistantBrief(
      body.name.trim(),
      dementiaClassification,
      profile,
    );

    database
      .prepare(
        "INSERT INTO patients (id, caregiver_id, patient_login_id, name, support_level, dementia_classification, daily_summary, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, '', ?, ?)",
      )
      .run(
        patientId,
        caregiverRow.id,
        patientLoginId,
        body.name.trim(),
        supportLevel,
        dementiaClassification,
        createdAt,
        createdAt,
      );

    database
      .prepare(
        "INSERT INTO patient_profiles (patient_id, identity_summary, important_people, preferences, comfort_notes, life_story, assistant_brief, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        patientId,
        profile.identitySummary,
        profile.importantPeople,
        profile.preferences,
        profile.comfortNotes,
        profile.lifeStory,
        assistantBrief,
        createdAt,
      );

    sendJson(response, 201, {
      dashboard: buildCaregiverDashboard(caregiverRow.id),
      patientBundle: buildPatientBundle(patientId),
    });
    return;
  }

  const patientProfileParams = matchPath(pathname, "/api/patients/:patientId/profile");
  if (request.method === "PUT" && patientProfileParams) {
    const body = await readBody(request);
    const patientRow = getPatientRow(patientProfileParams.patientId);

    if (!patientRow) {
      sendError(response, 404, "Patient not found.");
      return;
    }

    const updatedAt = now();
    const name = patientRow.name;
    const dementiaClassification = normalizeDementiaClassification(
      body.dementiaClassification ?? patientRow.dementia_classification,
    );
    const profile = {
      identitySummary: body.identitySummary?.trim() ?? "",
      importantPeople: body.importantPeople?.trim() ?? "",
      preferences: body.preferences?.trim() ?? "",
      comfortNotes: body.comfortNotes?.trim() ?? "",
      lifeStory: body.lifeStory?.trim() ?? "",
    };

    database
      .prepare(
        "UPDATE patients SET support_level = ?, dementia_classification = ?, updated_at = ? WHERE id = ?",
      )
      .run(
        body.supportLevel ?? patientRow.support_level,
        dementiaClassification,
        updatedAt,
        patientRow.id,
      );

    database
      .prepare(
        "UPDATE patient_profiles SET identity_summary = ?, important_people = ?, preferences = ?, comfort_notes = ?, life_story = ?, assistant_brief = ?, updated_at = ? WHERE patient_id = ?",
      )
      .run(
        profile.identitySummary,
        profile.importantPeople,
        profile.preferences,
        profile.comfortNotes,
        profile.lifeStory,
        buildAssistantBrief(name, dementiaClassification, profile),
        updatedAt,
        patientRow.id,
      );

    sendJson(response, 200, buildPatientBundle(patientRow.id));
    return;
  }

  const addMedicationParams = matchPath(pathname, "/api/patients/:patientId/medications");
  if (request.method === "POST" && addMedicationParams) {
    const body = await readBody(request);
    const patientRow = getPatientRow(addMedicationParams.patientId);

    if (!patientRow) {
      sendError(response, 404, "Patient not found.");
      return;
    }

    if (!body.name?.trim() || !body.dosage?.trim() || !body.instructions?.trim() || !body.scheduledTime?.trim()) {
      sendError(response, 400, "Medication name, dosage, instructions, and time are required.");
      return;
    }

    database
      .prepare(
        "INSERT INTO medications (id, patient_id, name, dosage, instructions, scheduled_time, status, created_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, NULL)",
      )
      .run(
        createId("medication"),
        patientRow.id,
        body.name.trim(),
        body.dosage.trim(),
        body.instructions.trim(),
        body.scheduledTime.trim(),
        now(),
      );

    sendJson(response, 201, buildPatientBundle(patientRow.id));
    return;
  }

  const addContactParams = matchPath(pathname, "/api/patients/:patientId/contacts");
  if (request.method === "POST" && addContactParams) {
    const body = await readBody(request);
    const patientRow = getPatientRow(addContactParams.patientId);

    if (!patientRow) {
      sendError(response, 404, "Patient not found.");
      return;
    }

    if (!body.name?.trim() || !body.phone?.trim() || !body.relationship?.trim()) {
      sendError(response, 400, "Contact name, phone, and relationship are required.");
      return;
    }

    database
      .prepare(
        "INSERT INTO contacts (id, patient_id, name, phone, relationship, is_primary, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        createId("contact"),
        patientRow.id,
        body.name.trim(),
        body.phone.trim(),
        body.relationship.trim(),
        body.isPrimary ? 1 : 0,
        now(),
      );

    sendJson(response, 201, buildPatientBundle(patientRow.id));
    return;
  }

  const addTaskParams = matchPath(pathname, "/api/patients/:patientId/tasks");
  if (request.method === "POST" && addTaskParams) {
    const body = await readBody(request);
    const patientRow = getPatientRow(addTaskParams.patientId);

    if (!patientRow) {
      sendError(response, 404, "Patient not found.");
      return;
    }

    if (!body.title?.trim() || !body.scheduledTime?.trim()) {
      sendError(response, 400, "Task title and time are required.");
      return;
    }

    database
      .prepare(
        "INSERT INTO routine_tasks (id, patient_id, title, description, scheduled_time, status, source, created_at, completed_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, NULL)",
      )
      .run(
        createId("task"),
        patientRow.id,
        body.title.trim(),
        body.description?.trim() ?? "",
        body.scheduledTime.trim(),
        body.source === "patient" ? "patient" : "caregiver",
        now(),
      );

    if (body.source === "patient") {
      createNotification(
        patientRow.caregiver_id,
        patientRow.id,
        "patient_task_added",
        `${patientRow.name} added "${body.title.trim()}" to the daily routine.`,
      );
    }

    sendJson(response, 201, buildPatientBundle(patientRow.id));
    return;
  }

  const toggleTaskParams = matchPath(pathname, "/api/tasks/:taskId/toggle");
  if (request.method === "PATCH" && toggleTaskParams) {
    const taskRow = database.prepare("SELECT * FROM routine_tasks WHERE id = ?").get(toggleTaskParams.taskId);

    if (!taskRow) {
      sendError(response, 404, "Task not found.");
      return;
    }

    const nextStatus = taskRow.status === "completed" ? "pending" : "completed";
    database
      .prepare("UPDATE routine_tasks SET status = ?, completed_at = ? WHERE id = ?")
      .run(nextStatus, nextStatus === "completed" ? now() : null, taskRow.id);

    sendJson(response, 200, buildPatientBundle(taskRow.patient_id));
    return;
  }

  const deleteTaskParams = matchPath(pathname, "/api/tasks/:taskId");
  if (request.method === "DELETE" && deleteTaskParams) {
    const taskRow = database.prepare("SELECT * FROM routine_tasks WHERE id = ?").get(deleteTaskParams.taskId);

    if (!taskRow) {
      sendError(response, 404, "Task not found.");
      return;
    }

    database.prepare("DELETE FROM routine_tasks WHERE id = ?").run(taskRow.id);

    sendJson(response, 200, buildPatientBundle(taskRow.patient_id));
    return;
  }

  const toggleMedicationParams = matchPath(pathname, "/api/medications/:medicationId/toggle");
  if (request.method === "PATCH" && toggleMedicationParams) {
    const medicationRow = database
      .prepare("SELECT * FROM medications WHERE id = ?")
      .get(toggleMedicationParams.medicationId);

    if (!medicationRow) {
      sendError(response, 404, "Medication not found.");
      return;
    }

    const nextStatus = medicationRow.status === "taken" ? "pending" : "taken";
    database
      .prepare("UPDATE medications SET status = ?, completed_at = ? WHERE id = ?")
      .run(nextStatus, nextStatus === "taken" ? now() : null, medicationRow.id);

    sendJson(response, 200, buildPatientBundle(medicationRow.patient_id));
    return;
  }

  const deleteMedicationParams = matchPath(pathname, "/api/medications/:medicationId");
  if (request.method === "DELETE" && deleteMedicationParams) {
    const medicationRow = database
      .prepare("SELECT * FROM medications WHERE id = ?")
      .get(deleteMedicationParams.medicationId);

    if (!medicationRow) {
      sendError(response, 404, "Medication not found.");
      return;
    }

    database.prepare("DELETE FROM medications WHERE id = ?").run(medicationRow.id);

    sendJson(response, 200, buildPatientBundle(medicationRow.patient_id));
    return;
  }

  const dailySummaryParams = matchPath(pathname, "/api/patients/:patientId/daily-summary");
  if (request.method === "PUT" && dailySummaryParams) {
    const body = await readBody(request);
    const patientRow = getPatientRow(dailySummaryParams.patientId);

    if (!patientRow) {
      sendError(response, 404, "Patient not found.");
      return;
    }

    database
      .prepare("UPDATE patients SET daily_summary = ?, updated_at = ? WHERE id = ?")
      .run(body.dailySummary?.trim() ?? "", now(), patientRow.id);

    createNotification(
      patientRow.caregiver_id,
      patientRow.id,
      "daily_summary_updated",
      `${patientRow.name} saved an end-of-day summary.`,
    );

    sendJson(response, 200, buildPatientBundle(patientRow.id));
    return;
  }

  const assistantParams = matchPath(pathname, "/api/patients/:patientId/assistant");
  if (request.method === "POST" && assistantParams) {
    const body = await readBody(request);
    const bundle = buildPatientBundle(assistantParams.patientId);

    if (!bundle) {
      sendError(response, 404, "Patient not found.");
      return;
    }

    if (!body.message?.trim()) {
      sendError(response, 400, "A message is required.");
      return;
    }

    const createdAt = now();

    database
      .prepare("INSERT INTO assistant_messages (id, patient_id, sender, content, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(createId("message"), bundle.patient.id, "patient", body.message.trim(), createdAt);

    const updatedBundle = buildPatientBundle(bundle.patient.id);
    const assistantReply = await createPatientAssistantReply(updatedBundle, body.message);

    database
      .prepare("INSERT INTO assistant_messages (id, patient_id, sender, content, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(createId("message"), bundle.patient.id, "assistant", assistantReply, now());

    sendJson(response, 200, buildPatientBundle(bundle.patient.id));
    return;
  }

  const careNoteAssistantParams = matchPath(pathname, "/api/patients/:patientId/care-note-assistant");
  if (request.method === "POST" && careNoteAssistantParams) {
    const body = await readBody(request);
    const bundle = buildPatientBundle(careNoteAssistantParams.patientId);

    if (!bundle) {
      sendError(response, 404, "Patient not found.");
      return;
    }

    if (!body.message?.trim()) {
      sendError(response, 400, "A message is required.");
      return;
    }

    database
      .prepare("INSERT INTO care_note_messages (id, patient_id, sender, content, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(createId("care_note"), bundle.patient.id, "caregiver", body.message.trim(), now());

    const updatedBundle = buildPatientBundle(bundle.patient.id);
    let assistantReply = "";

    try {
      assistantReply = await createCareNoteAssistantReply(updatedBundle, body.message);
    } catch (error) {
      assistantReply =
        error instanceof Error
          ? error.message
          : "The care note assistant could not respond right now.";
    }

    database
      .prepare("INSERT INTO care_note_messages (id, patient_id, sender, content, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(createId("care_note"), bundle.patient.id, "assistant", assistantReply, now());

    sendJson(response, 200, buildPatientBundle(bundle.patient.id));
    return;
  }

  const emergencyParams = matchPath(pathname, "/api/patients/:patientId/emergency-alerts");
  if (request.method === "POST" && emergencyParams) {
    const body = await readBody(request);
    const patientRow = getPatientRow(emergencyParams.patientId);

    if (!patientRow) {
      sendError(response, 404, "Patient not found.");
      return;
    }

    database
      .prepare(
        "INSERT INTO emergency_alerts (id, patient_id, triggered_by_role, created_at, status) VALUES (?, ?, ?, ?, 'sent')",
      )
      .run(createId("alert"), patientRow.id, body.triggeredByRole ?? "patient", now());

    createNotification(
      patientRow.caregiver_id,
      patientRow.id,
      "emergency_alert",
      `${patientRow.name} triggered an emergency alert.`,
    );

    sendJson(response, 201, buildPatientBundle(patientRow.id));
    return;
  }

  if (pathname.startsWith("/api")) {
    sendError(response, 404, "API route not found.");
    return;
  }

  if (isDevMode) {
    sendError(response, 404, "This server only handles API routes during development.");
    return;
  }

  serveStaticFile(request, response);
};

const server = createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    const message =
      error instanceof Error ? error.message : "An unexpected server error occurred.";

    sendError(response, 500, message);
  });
});

server.listen(port, () => {
  process.stdout.write(
    `Memento API server listening on http://127.0.0.1:${port}${isDevMode ? " (dev api mode)" : ""}\n`,
  );
  process.stdout.write(
    `[memento-ai] ${openAiApiKey ? `enabled with ${openAiModel}` : "disabled (missing OPENAI_API_KEY)"}\n`,
  );
});
