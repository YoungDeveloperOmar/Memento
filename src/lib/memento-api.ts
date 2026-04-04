import type {
  AddPatientValues,
  CaregiverAuthValues,
  CaregiverDashboardData,
  ContactFormInputValues,
  ContactFormValues,
  PatientAuthValues,
  PatientBundle,
  ProfileUpdateValues,
  TaskFormValues,
  UserRole,
} from "@/types/memento";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

const buildUrl = (path: string) => `${apiBaseUrl}${path}`;

const parseJson = async <T>(response: Response) => {
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : null;
};

const getErrorMessage = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = await parseJson<{ message?: string }>(response);
    if (data?.message) {
      return data.message;
    }
  }

  const text = await response.text();
  return text || "The request could not be completed.";
};

const requestJson = async <T>(path: string, init: RequestInit) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return parseJson<T>(response);
};

export const resolveDashboardPath = (role: UserRole) =>
  role === "caregiver" ? "/caregiver-dashboard" : "/patient-dashboard";

export const registerCaregiver = (payload: Required<CaregiverAuthValues>) =>
  requestJson<CaregiverDashboardData>("/api/auth/caregiver/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginCaregiver = (payload: CaregiverAuthValues) =>
  requestJson<CaregiverDashboardData>("/api/auth/caregiver/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginPatient = (payload: PatientAuthValues) =>
  requestJson<PatientBundle>("/api/auth/patient/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getCaregiverDashboard = (caregiverId: string) =>
  requestJson<CaregiverDashboardData>(`/api/caregivers/${caregiverId}/dashboard`, {
    method: "GET",
  });

export const getPatientDashboard = (patientId: string) =>
  requestJson<PatientBundle>(`/api/patients/${patientId}/dashboard`, {
    method: "GET",
  });

export const addPatient = (caregiverId: string, payload: AddPatientValues) =>
  requestJson<{ dashboard: CaregiverDashboardData; patientBundle: PatientBundle }>(
    `/api/caregivers/${caregiverId}/patients`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

export const updatePatientProfile = (patientId: string, payload: ProfileUpdateValues) =>
  requestJson<PatientBundle>(`/api/patients/${patientId}/profile`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const addMedication = (
  patientId: string,
  payload: {
    name: string;
    dosage: string;
    instructions: string;
    scheduledTime: string;
  },
) =>
  requestJson<PatientBundle>(`/api/patients/${patientId}/medications`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const addContact = (patientId: string, payload: ContactFormInputValues) =>
  requestJson<PatientBundle>(`/api/patients/${patientId}/contacts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const toggleMedication = (medicationId: string) =>
  requestJson<PatientBundle>(`/api/medications/${medicationId}/toggle`, {
    method: "PATCH",
  });

export const addTask = (
  patientId: string,
  payload: TaskFormValues & { source: "caregiver" | "patient" },
) =>
  requestJson<PatientBundle>(`/api/patients/${patientId}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const toggleTask = (taskId: string) =>
  requestJson<PatientBundle>(`/api/tasks/${taskId}/toggle`, {
    method: "PATCH",
  });

export const updateDailySummary = (patientId: string, payload: { dailySummary: string }) =>
  requestJson<PatientBundle>(`/api/patients/${patientId}/daily-summary`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const sendAssistantMessage = (patientId: string, payload: { message: string }) =>
  requestJson<PatientBundle>(`/api/patients/${patientId}/assistant`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const sendEmergencyAlert = (
  patientId: string,
  payload: { triggeredByRole: UserRole },
) =>
  requestJson<PatientBundle>(`/api/patients/${patientId}/emergency-alerts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const submitSupportRequest = (payload: ContactFormValues) =>
  requestJson<{ status: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
