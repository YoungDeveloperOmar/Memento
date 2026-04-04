export type UserRole = "caregiver" | "patient";

export type SupportLevel = "early" | "middle" | "late";

export type DementiaClassification =
  | "alzheimers-disease"
  | "vascular-dementia"
  | "lewy-body-dementia"
  | "frontotemporal-dementia"
  | "mixed-dementia"
  | "other";

export type MedicationStatus = "pending" | "taken";

export type TaskStatus = "pending" | "completed";

export type TaskSource = "caregiver" | "patient";

export interface Caregiver {
  id: string;
  role: "caregiver";
  name: string;
  email: string;
  patientIds: string[];
  createdAt: string;
}

export interface Patient {
  id: string;
  role: "patient";
  caregiverId: string;
  patientLoginId: string;
  name: string;
  supportLevel: SupportLevel;
  dementiaClassification: DementiaClassification;
  dailySummary: string;
  createdAt: string;
}

export interface PatientProfile {
  patientId: string;
  identitySummary: string;
  importantPeople: string;
  preferences: string;
  comfortNotes: string;
  lifeStory: string;
  assistantBrief: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  instructions: string;
  scheduledTime: string;
  status: MedicationStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Contact {
  id: string;
  patientId: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface ScheduledTask {
  id: string;
  patientId: string;
  title: string;
  description: string;
  scheduledTime: string;
  status: TaskStatus;
  source: TaskSource;
  createdAt: string;
  completedAt?: string;
}

export interface Routine {
  id: string;
  patientId: string;
  title: string;
  description: string;
  tasks: ScheduledTask[];
  createdAt: string;
}

export interface EmergencyAlert {
  id: string;
  patientId: string;
  triggeredByRole: UserRole;
  createdAt: string;
  status: "queued" | "sent";
}

export interface CaregiverNotification {
  id: string;
  caregiverId: string;
  patientId: string;
  type: "patient_task_added" | "daily_summary_updated" | "emergency_alert";
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface AssistantMessage {
  id: string;
  patientId: string;
  sender: "patient" | "assistant";
  content: string;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface PatientBundle {
  caregiver: Pick<Caregiver, "id" | "name" | "email">;
  patient: Patient;
  profile: PatientProfile;
  medications: Medication[];
  contacts: Contact[];
  routine: Routine;
  emergencyAlerts: EmergencyAlert[];
  assistantMessages: AssistantMessage[];
}

export interface CaregiverDashboardData {
  caregiver: Caregiver;
  patients: Patient[];
  notifications: CaregiverNotification[];
}

export interface AddPatientValues {
  name: string;
  supportLevel: SupportLevel;
  dementiaClassification: DementiaClassification;
  identitySummary: string;
  importantPeople: string;
  preferences: string;
  comfortNotes: string;
  lifeStory: string;
}

export interface CaregiverAuthValues {
  fullName?: string;
  email: string;
  password: string;
}

export interface PatientAuthValues {
  patientLoginId: string;
}

export interface MedicationFormValues {
  name: string;
  dosage: string;
  instructions: string;
  scheduledTime: string;
}

export interface ContactFormInputValues {
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface TaskFormValues {
  title: string;
  description: string;
  scheduledTime: string;
}

export interface ProfileUpdateValues {
  supportLevel: SupportLevel;
  dementiaClassification: DementiaClassification;
  identitySummary: string;
  importantPeople: string;
  preferences: string;
  comfortNotes: string;
  lifeStory: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export type SessionState =
  | {
      role: "caregiver";
      caregiverId: string;
    }
  | {
      role: "patient";
      patientId: string;
    };
