import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  addContact as addContactRequest,
  addMedication as addMedicationRequest,
  addPatient as addPatientRequest,
  addTask as addTaskRequest,
  getCaregiverDashboard,
  getPatientDashboard,
  loginCaregiver,
  loginPatient,
  registerCaregiver,
  sendAssistantMessage as sendAssistantMessageRequest,
  sendEmergencyAlert as sendEmergencyAlertRequest,
  submitSupportRequest as submitSupportRequestRequest,
  toggleMedication as toggleMedicationRequest,
  toggleTask as toggleTaskRequest,
  updateDailySummary as updateDailySummaryRequest,
  updatePatientProfile as updatePatientProfileRequest,
} from "@/lib/memento-api";
import type {
  AddPatientValues,
  Caregiver,
  CaregiverAuthValues,
  CaregiverDashboardData,
  CaregiverNotification,
  ContactFormInputValues,
  ContactFormValues,
  MedicationFormValues,
  Patient,
  PatientAuthValues,
  PatientBundle,
  ProfileUpdateValues,
  SessionState,
  TaskFormValues,
  UserRole,
} from "@/types/memento";

const STORAGE_KEY = "memento-session-v3";

type MementoContextValue = {
  session: SessionState | null;
  isHydrating: boolean;
  currentRole: UserRole | null;
  caregiver: Caregiver | null;
  caregiverPatients: Patient[];
  notifications: CaregiverNotification[];
  selectedPatientId: string | null;
  selectedPatient: Patient | null;
  activePatientBundle: PatientBundle | null;
  caregiverSignUp: (values: Required<CaregiverAuthValues>) => Promise<void>;
  caregiverSignIn: (values: CaregiverAuthValues) => Promise<void>;
  patientSignIn: (values: PatientAuthValues) => Promise<void>;
  signOut: () => void;
  selectPatient: (patientId: string) => Promise<void>;
  addPatient: (values: AddPatientValues) => Promise<PatientBundle>;
  savePatientProfile: (patientId: string, values: ProfileUpdateValues) => Promise<PatientBundle>;
  addMedication: (patientId: string, values: MedicationFormValues) => Promise<PatientBundle>;
  addContact: (patientId: string, values: ContactFormInputValues) => Promise<PatientBundle>;
  toggleMedicationStatus: (medicationId: string) => Promise<PatientBundle>;
  addRoutineTask: (
    patientId: string,
    values: TaskFormValues,
    source: "caregiver" | "patient",
  ) => Promise<PatientBundle>;
  toggleRoutineTaskStatus: (taskId: string) => Promise<PatientBundle>;
  updateDailySummary: (patientId: string, dailySummary: string) => Promise<PatientBundle>;
  sendAssistantMessage: (patientId: string, message: string) => Promise<PatientBundle>;
  sendEmergencyAlert: (patientId: string, triggeredByRole: UserRole) => Promise<PatientBundle>;
  submitSupportRequest: (values: ContactFormValues) => Promise<void>;
  refreshSession: () => Promise<void>;
};

const MementoContext = createContext<MementoContextValue | null>(null);

const readSession = (): SessionState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as SessionState;
  } catch {
    return null;
  }
};

const upsertPatient = (patients: Patient[], nextPatient: Patient) => {
  const existingPatient = patients.find((patient) => patient.id === nextPatient.id);

  if (!existingPatient) {
    return [...patients, nextPatient];
  }

  return patients.map((patient) => (patient.id === nextPatient.id ? nextPatient : patient));
};

export const MementoProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionState | null>(() => readSession());
  const [isHydrating, setIsHydrating] = useState(true);
  const [caregiverDashboard, setCaregiverDashboard] = useState<CaregiverDashboardData | null>(null);
  const [patientBundlesById, setPatientBundlesById] = useState<Record<string, PatientBundle>>({});
  const [patientSessionBundle, setPatientSessionBundle] = useState<PatientBundle | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!session) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const applyPatientBundle = useCallback((bundle: PatientBundle) => {
    setPatientBundlesById((currentBundles) => ({
      ...currentBundles,
      [bundle.patient.id]: bundle,
    }));
    setPatientSessionBundle((currentBundle) =>
      currentBundle?.patient.id === bundle.patient.id ? bundle : currentBundle,
    );
    setCaregiverDashboard((currentDashboard) =>
      currentDashboard
        ? {
            ...currentDashboard,
            patients: upsertPatient(currentDashboard.patients, bundle.patient),
          }
        : currentDashboard,
    );
  }, []);

  const applyCaregiverDashboard = useCallback((dashboard: CaregiverDashboardData) => {
    setCaregiverDashboard(dashboard);
    setSelectedPatientId((currentSelectedPatientId) => {
      if (!dashboard.patients.length) {
        return null;
      }

      if (currentSelectedPatientId && dashboard.patients.some((patient) => patient.id === currentSelectedPatientId)) {
        return currentSelectedPatientId;
      }

      return dashboard.patients[0].id;
    });
  }, []);

  const refreshPatientBundle = useCallback(
    async (patientId: string) => {
      const bundle = await getPatientDashboard(patientId);
      applyPatientBundle(bundle);
      return bundle;
    },
    [applyPatientBundle],
  );

  const refreshCaregiverState = useCallback(
    async (caregiverId: string) => {
      const dashboard = await getCaregiverDashboard(caregiverId);
      applyCaregiverDashboard(dashboard);
      return dashboard;
    },
    [applyCaregiverDashboard],
  );

  const refreshSession = useCallback(async () => {
    if (!session) {
      setCaregiverDashboard(null);
      setPatientSessionBundle(null);
      setPatientBundlesById({});
      setSelectedPatientId(null);
      setIsHydrating(false);
      return;
    }

    setIsHydrating(true);

    try {
      if (session.role === "caregiver") {
        const dashboard = await refreshCaregiverState(session.caregiverId);

        if (dashboard.patients.length) {
          const nextSelectedPatientId =
            selectedPatientId && dashboard.patients.some((patient) => patient.id === selectedPatientId)
              ? selectedPatientId
              : dashboard.patients[0].id;

          setSelectedPatientId(nextSelectedPatientId);
          await refreshPatientBundle(nextSelectedPatientId);
        } else {
          setSelectedPatientId(null);
        }

        setPatientSessionBundle(null);
        return;
      }

      const bundle = await refreshPatientBundle(session.patientId);
      setPatientSessionBundle(bundle);
      setCaregiverDashboard(null);
      setSelectedPatientId(bundle.patient.id);
    } finally {
      setIsHydrating(false);
    }
  }, [refreshCaregiverState, refreshPatientBundle, selectedPatientId, session]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshSession();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [refreshSession, session]);

  const currentRole = session?.role ?? null;
  const caregiver = caregiverDashboard?.caregiver ?? null;
  const caregiverPatients = caregiverDashboard?.patients ?? [];
  const notifications = caregiverDashboard?.notifications ?? [];
  const selectedPatient =
    caregiverPatients.find((patient) => patient.id === selectedPatientId) ??
    (patientSessionBundle?.patient ?? null);
  const activePatientBundle =
    currentRole === "patient"
      ? patientSessionBundle
      : selectedPatientId
        ? patientBundlesById[selectedPatientId] ?? null
        : null;

  const caregiverSignUp = async (values: Required<CaregiverAuthValues>) => {
    const dashboard = await registerCaregiver(values);
    setSession({
      role: "caregiver",
      caregiverId: dashboard.caregiver.id,
    });
    applyCaregiverDashboard(dashboard);
    setPatientBundlesById({});
    setPatientSessionBundle(null);
  };

  const caregiverSignIn = async (values: CaregiverAuthValues) => {
    const dashboard = await loginCaregiver(values);
    setSession({
      role: "caregiver",
      caregiverId: dashboard.caregiver.id,
    });
    applyCaregiverDashboard(dashboard);
    setPatientBundlesById({});
    setPatientSessionBundle(null);
  };

  const patientSignIn = async (values: PatientAuthValues) => {
    const bundle = await loginPatient(values);
    setSession({
      role: "patient",
      patientId: bundle.patient.id,
    });
    setCaregiverDashboard(null);
    setSelectedPatientId(bundle.patient.id);
    setPatientBundlesById({
      [bundle.patient.id]: bundle,
    });
    setPatientSessionBundle(bundle);
  };

  const signOut = () => {
    setSession(null);
    setCaregiverDashboard(null);
    setPatientBundlesById({});
    setPatientSessionBundle(null);
    setSelectedPatientId(null);
    setIsHydrating(false);
  };

  const selectPatient = useCallback(
    async (patientId: string) => {
      setSelectedPatientId(patientId);

      if (!patientBundlesById[patientId]) {
        await refreshPatientBundle(patientId);
      }
    },
    [patientBundlesById, refreshPatientBundle],
  );

  const addPatient = async (values: AddPatientValues) => {
    if (!session || session.role !== "caregiver") {
      throw new Error("Only caregivers can add patients.");
    }

    const response = await addPatientRequest(session.caregiverId, values);
    applyCaregiverDashboard(response.dashboard);
    applyPatientBundle(response.patientBundle);
    setSelectedPatientId(response.patientBundle.patient.id);
    return response.patientBundle;
  };

  const savePatientProfile = async (patientId: string, values: ProfileUpdateValues) => {
    const bundle = await updatePatientProfileRequest(patientId, values);
    applyPatientBundle(bundle);
    return bundle;
  };

  const addMedication = async (patientId: string, values: MedicationFormValues) => {
    const bundle = await addMedicationRequest(patientId, values);
    applyPatientBundle(bundle);
    return bundle;
  };

  const addContact = async (patientId: string, values: ContactFormInputValues) => {
    const bundle = await addContactRequest(patientId, values);
    applyPatientBundle(bundle);
    return bundle;
  };

  const toggleMedicationStatus = async (medicationId: string) => {
    const bundle = await toggleMedicationRequest(medicationId);
    applyPatientBundle(bundle);
    return bundle;
  };

  const addRoutineTask = async (
    patientId: string,
    values: TaskFormValues,
    source: "caregiver" | "patient",
  ) => {
    const bundle = await addTaskRequest(patientId, {
      ...values,
      source,
    });
    applyPatientBundle(bundle);

    if (session?.role === "caregiver") {
      await refreshCaregiverState(session.caregiverId);
    }

    return bundle;
  };

  const toggleRoutineTaskStatus = async (taskId: string) => {
    const bundle = await toggleTaskRequest(taskId);
    applyPatientBundle(bundle);
    return bundle;
  };

  const updateDailySummary = async (patientId: string, dailySummary: string) => {
    const bundle = await updateDailySummaryRequest(patientId, { dailySummary });
    applyPatientBundle(bundle);

    if (session?.role === "patient") {
      setPatientSessionBundle(bundle);
    }

    return bundle;
  };

  const sendAssistantMessage = async (patientId: string, message: string) => {
    const bundle = await sendAssistantMessageRequest(patientId, { message });
    applyPatientBundle(bundle);
    return bundle;
  };

  const sendEmergencyAlert = async (patientId: string, triggeredByRole: UserRole) => {
    const bundle = await sendEmergencyAlertRequest(patientId, { triggeredByRole });
    applyPatientBundle(bundle);

    if (session?.role === "caregiver") {
      await refreshCaregiverState(session.caregiverId);
    }

    return bundle;
  };

  const submitSupportRequest = async (values: ContactFormValues) => {
    await submitSupportRequestRequest(values);
  };

  const value: MementoContextValue = {
    session,
    isHydrating,
    currentRole,
    caregiver,
    caregiverPatients,
    notifications,
    selectedPatientId,
    selectedPatient,
    activePatientBundle,
    caregiverSignUp,
    caregiverSignIn,
    patientSignIn,
    signOut,
    selectPatient,
    addPatient,
    savePatientProfile,
    addMedication,
    addContact,
    toggleMedicationStatus,
    addRoutineTask,
    toggleRoutineTaskStatus,
    updateDailySummary,
    sendAssistantMessage,
    sendEmergencyAlert,
    submitSupportRequest,
    refreshSession,
  };

  return <MementoContext.Provider value={value}>{children}</MementoContext.Provider>;
};

export const useMemento = () => {
  const context = useContext(MementoContext);

  if (!context) {
    throw new Error("useMemento must be used within MementoProvider.");
  }

  return context;
};
