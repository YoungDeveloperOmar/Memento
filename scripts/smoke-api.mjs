const baseUrl = (process.env.SMOKE_API_BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const requestJson = async (path, init) => {
  const response = await fetch(`${baseUrl}${path}`, init);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  return {
    status: response.status,
    data,
  };
};

const waitForServer = async () => {
  let lastError = null;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/unknown-route`);

      if (response.status === 404) {
        return;
      }
    } catch (error) {
      lastError = error;
    }

    await wait(500);
  }

  throw new Error(
    `Smoke test server was not reachable at ${baseUrl}.${lastError instanceof Error ? ` ${lastError.message}` : ""}`,
  );
};

const assertStatus = (result, expectedStatus, label) => {
  if (result.status !== expectedStatus) {
    throw new Error(
      `${label} failed. Expected ${expectedStatus}, received ${result.status}. Response: ${JSON.stringify(result.data)}`,
    );
  }
};

const run = async () => {
  await waitForServer();

  const email = `ci-${Date.now()}@memento.test`;
  const registerCaregiver = await requestJson("/api/auth/caregiver/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: "CI Smoke Test",
      email,
      password: "SecurePass1",
    }),
  });

  assertStatus(registerCaregiver, 201, "Caregiver registration");

  const caregiverId = registerCaregiver.data?.caregiver?.id;

  if (!caregiverId) {
    throw new Error("Caregiver registration did not return a caregiver id.");
  }

  const createPatient = await requestJson(`/api/caregivers/${caregiverId}/patients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "CI Patient",
      supportLevel: "middle",
      dementiaClassification: "vascular-dementia",
      identitySummary: "You are CI Patient and you feel calmer with short reminders.",
      importantPeople: "Your daughter Ava and your son Noah.",
      preferences: "Tea after breakfast and a short afternoon walk.",
      comfortNotes: "A calm tone and one-step instructions help.",
      lifeStory: "You enjoy family stories and quiet afternoons.",
    }),
  });

  assertStatus(createPatient, 201, "Patient creation");

  const patientLoginId = createPatient.data?.patientBundle?.patient?.patientLoginId;

  if (!patientLoginId) {
    throw new Error("Patient creation did not return a patient login id.");
  }

  const patientLogin = await requestJson("/api/auth/patient/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientLoginId,
    }),
  });

  assertStatus(patientLogin, 200, "Patient login");

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        caregiverId,
        patientId: patientLogin.data?.patient?.id,
        patientLoginId,
      },
      null,
      2,
    )}\n`,
  );
};

run().catch((error) => {
  const message = error instanceof Error ? error.message : "Smoke test failed.";
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
