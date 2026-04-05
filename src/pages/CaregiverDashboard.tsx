import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  ClipboardList,
  Heart,
  KeyRound,
  MessageSquare,
  Pill,
  Plus,
  ShieldAlert,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMemento } from "@/context/MementoContext";
import { toast } from "@/hooks/use-toast";
import {
  dementiaClassificationOptions,
  formatClockTime,
  formatDementiaClassification,
  formatSupportLevel,
  supportLevelOptions,
  toTelHref,
} from "@/lib/memento-utils";

const dementiaClassificationValues = [
  "alzheimers-disease",
  "vascular-dementia",
  "lewy-body-dementia",
  "frontotemporal-dementia",
  "mixed-dementia",
  "other",
] as const;

const addPatientSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's name."),
  supportLevel: z.enum(["early", "middle", "late"]),
  dementiaClassification: z.enum(dementiaClassificationValues),
  identitySummary: z
    .string()
    .trim()
    .min(10, "Add a short introduction for the patient."),
  importantPeople: z
    .string()
    .trim()
    .min(3, "List the important people in the patient's life."),
  preferences: z.string().trim().min(3, "Describe routines or preferences."),
  comfortNotes: z.string().trim().min(3, "Add comfort notes or calming guidance."),
  lifeStory: z.string().trim().min(3, "Add a life-story note for the assistant."),
});

const profileSchema = addPatientSchema.omit({ name: true });

const medicationSchema = z.object({
  name: z.string().trim().min(2, "Enter a medication name."),
  dosage: z.string().trim().min(1, "Enter the dosage."),
  instructions: z.string().trim().min(2, "Add brief instructions."),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, "Select a valid time."),
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter a contact name."),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .regex(/^[\d()+\-\s]+$/, "Use digits and standard phone symbols only."),
  relationship: z.string().trim().min(2, "Describe the relationship."),
  isPrimary: z.boolean().default(false),
});

const taskSchema = z.object({
  title: z.string().trim().min(2, "Enter a task title."),
  description: z.string().trim().max(180, "Keep the note under 180 characters."),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, "Select a valid time."),
});

const careNoteSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, "Enter a message for the care note assistant.")
    .max(1200, "Keep the note under 1200 characters."),
});

type AddPatientValues = z.infer<typeof addPatientSchema>;
type ProfileValues = z.infer<typeof profileSchema>;
type MedicationValues = z.infer<typeof medicationSchema>;
type ContactValues = z.infer<typeof contactSchema>;
type TaskValues = z.infer<typeof taskSchema>;
type CareNoteValues = z.infer<typeof careNoteSchema>;

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const summarize = (value: string, fallback: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  if (trimmed.length <= 120) {
    return trimmed;
  }

  return `${trimmed.slice(0, 117).trimEnd()}...`;
};

const CaregiverDashboard = () => {
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isPatientDataOpen, setIsPatientDataOpen] = useState(false);
  const [isMedicationOpen, setIsMedicationOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [pendingMedicationDeleteId, setPendingMedicationDeleteId] = useState<string | null>(null);
  const [pendingTaskDeleteId, setPendingTaskDeleteId] = useState<string | null>(null);
  const {
    currentRole,
    isHydrating,
    caregiver,
    caregiverPatients,
    notifications,
    selectedPatientId,
    activePatientBundle,
    selectPatient,
    addPatient,
    savePatientProfile,
    addMedication,
    addContact,
    addRoutineTask,
    removeMedication,
    removeRoutineTask,
    sendCareNoteMessage,
  } = useMemento();

  const addPatientForm = useForm<AddPatientValues>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      name: "",
      supportLevel: "early",
      dementiaClassification: "alzheimers-disease",
      identitySummary: "",
      importantPeople: "",
      preferences: "",
      comfortNotes: "",
      lifeStory: "",
    },
  });

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      supportLevel: "early",
      dementiaClassification: "alzheimers-disease",
      identitySummary: "",
      importantPeople: "",
      preferences: "",
      comfortNotes: "",
      lifeStory: "",
    },
  });

  const medicationForm = useForm<MedicationValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      dosage: "",
      instructions: "",
      scheduledTime: "",
    },
  });

  const contactForm = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      relationship: "",
      isPrimary: false,
    },
  });

  const taskForm = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      scheduledTime: "",
    },
  });

  const careNoteForm = useForm<CareNoteValues>({
    resolver: zodResolver(careNoteSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (activePatientBundle) {
      profileForm.reset({
        supportLevel: activePatientBundle.patient.supportLevel,
        dementiaClassification: activePatientBundle.patient.dementiaClassification,
        identitySummary: activePatientBundle.profile.identitySummary,
        importantPeople: activePatientBundle.profile.importantPeople,
        preferences: activePatientBundle.profile.preferences,
        comfortNotes: activePatientBundle.profile.comfortNotes,
        lifeStory: activePatientBundle.profile.lifeStory,
      });
    }
  }, [activePatientBundle, profileForm]);

  if (!currentRole && !isHydrating) {
    return <Navigate to="/auth" replace />;
  }

  if (currentRole === "patient") {
    return <Navigate to="/patient-dashboard" replace />;
  }

  const patientBundle = activePatientBundle;
  const patient = patientBundle?.patient ?? null;
  const profile = patientBundle?.profile ?? null;
  const routineTasks = patientBundle?.routine.tasks ?? [];
  const medications = patientBundle?.medications ?? [];
  const contacts = patientBundle?.contacts ?? [];
  const careNoteMessages = patientBundle?.careNoteMessages ?? [];

  const handleAddPatient = addPatientForm.handleSubmit(async (values) => {
    try {
      const bundle = await addPatient(values);
      toast({
        title: "Patient added",
        description: `${bundle.patient.name} now has the patient ID ${bundle.patient.patientLoginId}.`,
      });
      addPatientForm.reset();
      setIsAddPatientOpen(false);
    } catch (error) {
      toast({
        title: "Unable to add patient",
        description: error instanceof Error ? error.message : "Patient creation failed.",
        variant: "destructive",
      });
    }
  });

  const handleProfileSave = profileForm.handleSubmit(async (values) => {
    if (!patient) {
      return;
    }

    try {
      await savePatientProfile(patient.id, values);
      toast({
        title: "Patient data saved",
        description: `${patient.name}'s profile has been updated.`,
      });
      setIsPatientDataOpen(false);
    } catch (error) {
      toast({
        title: "Unable to save profile",
        description: error instanceof Error ? error.message : "Profile update failed.",
        variant: "destructive",
      });
    }
  });

  const handleAddMedication = medicationForm.handleSubmit(async (values) => {
    if (!patient) {
      return;
    }

    try {
      await addMedication(patient.id, values);
      toast({
        title: "Medication added",
        description: `${values.name} was added to ${patient.name}'s medication schedule.`,
      });
      medicationForm.reset();
      setIsMedicationOpen(false);
    } catch (error) {
      toast({
        title: "Unable to add medication",
        description: error instanceof Error ? error.message : "Medication could not be saved.",
        variant: "destructive",
      });
    }
  });

  const handleAddContact = contactForm.handleSubmit(async (values) => {
    if (!patient) {
      return;
    }

    try {
      await addContact(patient.id, values);
      toast({
        title: "Contact added",
        description: `${values.name} was added to ${patient.name}'s emergency contacts.`,
      });
      contactForm.reset();
      setIsContactOpen(false);
    } catch (error) {
      toast({
        title: "Unable to add contact",
        description: error instanceof Error ? error.message : "Contact could not be saved.",
        variant: "destructive",
      });
    }
  });

  const handleAddTask = taskForm.handleSubmit(async (values) => {
    if (!patient) {
      return;
    }

    try {
      await addRoutineTask(patient.id, values, "caregiver");
      toast({
        title: "Routine task added",
        description: `${values.title} was added to ${patient.name}'s routine.`,
      });
      taskForm.reset();
    } catch (error) {
      toast({
        title: "Unable to add task",
        description: error instanceof Error ? error.message : "Task could not be saved.",
        variant: "destructive",
      });
    }
  });

  const handleRemoveTask = async (taskId: string, taskTitle: string) => {
    if (!patient) {
      return;
    }

    setPendingTaskDeleteId(taskId);

    try {
      await removeRoutineTask(taskId);
      toast({
        title: "Routine task removed",
        description: `${taskTitle} was removed from ${patient.name}'s routine.`,
      });
    } catch (error) {
      toast({
        title: "Unable to remove task",
        description: error instanceof Error ? error.message : "Task could not be removed.",
        variant: "destructive",
      });
    } finally {
      setPendingTaskDeleteId(null);
    }
  };

  const handleRemoveMedication = async (medicationId: string, medicationName: string) => {
    if (!patient) {
      return;
    }

    setPendingMedicationDeleteId(medicationId);

    try {
      await removeMedication(medicationId);
      toast({
        title: "Medication removed",
        description: `${medicationName} was removed from ${patient.name}'s schedule.`,
      });
    } catch (error) {
      toast({
        title: "Unable to remove medication",
        description: error instanceof Error ? error.message : "Medication could not be removed.",
        variant: "destructive",
      });
    } finally {
      setPendingMedicationDeleteId(null);
    }
  };

  const handleCareNoteMessage = careNoteForm.handleSubmit(async (values) => {
    if (!patient) {
      return;
    }

    try {
      await sendCareNoteMessage(patient.id, values.message);
      careNoteForm.reset();
    } catch (error) {
      toast({
        title: "Assistant unavailable",
        description:
          error instanceof Error
            ? error.message
            : "The care note assistant could not respond.",
        variant: "destructive",
      });
    }
  });

  const profileFields = [
    {
      name: "identitySummary" as const,
      label: "Who is this person?",
      placeholder: "Describe how the assistant should identify the patient.",
    },
    {
      name: "importantPeople" as const,
      label: "Who are they close to?",
      placeholder: "List family members, friends, or caregivers they ask about often.",
    },
    {
      name: "preferences" as const,
      label: "What routines or preferences matter most?",
      placeholder: "Meals, habits, times of day, favorite activities, and patterns.",
    },
    {
      name: "comfortNotes" as const,
      label: "What helps them feel calm and safe?",
      placeholder: "Tone, music, reminders, grounding details, or helpful cues.",
    },
    {
      name: "lifeStory" as const,
      label: "Life story or identity details",
      placeholder: "Background details the assistant should remember.",
    },
  ];

  return (
    <Layout>
      <section className="px-4 py-10 md:py-14">
        <div className="container mx-auto max-w-[1680px] space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground">Caregiver Portal</p>
              <h1 className="font-heading text-section-sm md:text-section">
                {caregiver ? `Hello, ${caregiver.name}` : "Caregiver Dashboard"}
              </h1>
              <p className="max-w-3xl text-muted-foreground">
                Add patients, manage care data, and keep the patient portal
                synchronized from the same record.
              </p>
            </div>
            <Button onClick={() => setIsAddPatientOpen(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Patient
            </Button>
          </div>

          {!caregiverPatients.length ? (
            <div className="rounded-3xl border bg-card p-8 shadow-sm">
              <div className="max-w-2xl space-y-4">
                <UserPlus className="h-12 w-12 text-primary" />
                <h2 className="text-2xl font-bold">No patients linked yet</h2>
                <p className="text-muted-foreground">
                  Caregivers can register without patients. Use the Add Patient
                  button to open the intake flow, fill out the first memory prompts,
                  and generate the patient&apos;s unique login ID.
                </p>
                <Button onClick={() => setIsAddPatientOpen(true)} size="lg">
                  Start Patient Intake
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="space-y-6">
                <div className="rounded-3xl border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky">
                      <Users className="h-6 w-6 text-foreground/70" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Patients</h2>
                      <p className="text-sm text-muted-foreground">
                        {caregiverPatients.length} linked
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {caregiverPatients.map((caregiverPatient) => (
                      <button
                        key={caregiverPatient.id}
                        type="button"
                        onClick={() => void selectPatient(caregiverPatient.id)}
                        className={`w-full rounded-3xl border-2 p-4 text-left transition-colors ${
                          selectedPatientId === caregiverPatient.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="font-semibold">{caregiverPatient.name}</div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {formatSupportLevel(caregiverPatient.supportLevel)} •{" "}
                          {formatDementiaClassification(
                            caregiverPatient.dementiaClassification,
                          )}
                        </p>
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-primary">
                          {caregiverPatient.patientLoginId}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warm/20">
                      <Bell className="h-6 w-6 text-warm" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Notifications</h2>
                      <p className="text-sm text-muted-foreground">
                        Patient updates and alerts
                      </p>
                    </div>
                  </div>

                  {notifications.length ? (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="rounded-3xl bg-muted p-4">
                          <p className="font-medium leading-8">{notification.message}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                            {formatTimestamp(notification.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-3xl bg-muted p-4 text-sm text-muted-foreground">
                      No notifications yet. Patient task additions, summaries, and SOS
                      alerts will appear here.
                    </div>
                  )}
                </div>
              </aside>

              <div className="space-y-6">
                {patient && profile ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                      <div className="rounded-3xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage">
                            <Heart className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Selected Patient
                            </p>
                            <h2 className="text-2xl font-bold">{patient.name}</h2>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
                            <KeyRound className="h-7 w-7 text-foreground/70" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Patient Login ID
                            </p>
                            <h2 className="text-2xl font-bold">
                              {patient.patientLoginId}
                            </h2>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky">
                            <ShieldAlert className="h-7 w-7 text-foreground/70" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Support Level
                            </p>
                            <h2 className="text-2xl font-bold">
                              {formatSupportLevel(patient.supportLevel)}
                            </h2>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                            <ClipboardList className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Dementia Classification
                            </p>
                            <h2 className="text-2xl font-bold">
                              {formatDementiaClassification(
                                patient.dementiaClassification,
                              )}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.25fr)_420px]">
                      <div className="space-y-6">
                        <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                <MessageSquare className="h-7 w-7 text-primary" />
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold">Patient Data</h2>
                                <p className="text-sm text-muted-foreground">
                                  Open the full patient profile, review memory data,
                                  and edit it when needed.
                                </p>
                              </div>
                            </div>
                            <Button onClick={() => setIsPatientDataOpen(true)}>
                              Open Patient Data
                            </Button>
                          </div>

                          <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <div className="rounded-3xl bg-secondary/50 p-5">
                              <p className="text-sm font-semibold text-muted-foreground">
                                Identity Snapshot
                              </p>
                              <p className="mt-3 leading-8">
                                {summarize(
                                  profile.identitySummary,
                                  "No identity notes saved yet.",
                                )}
                              </p>
                            </div>
                            <div className="rounded-3xl bg-secondary/50 p-5">
                              <p className="text-sm font-semibold text-muted-foreground">
                                Important People
                              </p>
                              <p className="mt-3 leading-8">
                                {summarize(
                                  profile.importantPeople,
                                  "No close contacts noted yet.",
                                )}
                              </p>
                            </div>
                          </div>

                          <p className="mt-5 text-sm text-muted-foreground">
                            Last updated {formatTimestamp(profile.updatedAt)}
                          </p>
                        </div>

                        <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                          <div className="mb-5 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/70">
                              <MessageSquare className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold">
                                Care Note Assistant
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                AI chat for refining memory cues, calmer phrasing,
                                and caregiver-facing notes.
                              </p>
                            </div>
                          </div>

                          <div className="max-h-[320px] space-y-3 overflow-y-auto rounded-3xl bg-secondary/40 p-4">
                            {careNoteMessages.length ? (
                              careNoteMessages.map((message) => (
                                <div
                                  key={message.id}
                                  className={`rounded-3xl p-4 ${
                                    message.sender === "assistant"
                                      ? "bg-card"
                                      : "ml-auto max-w-[86%] bg-primary/10"
                                  }`}
                                >
                                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                    {message.sender === "assistant"
                                      ? "Assistant"
                                      : "Caregiver"}
                                  </p>
                                  <p className="mt-2 whitespace-pre-wrap leading-8">
                                    {message.content}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-3xl bg-card p-4 text-sm text-muted-foreground">
                                Ask the assistant to improve a reminder, rewrite a
                                comfort cue, or help phrase something more gently
                                for the patient.
                              </div>
                            )}
                          </div>

                          <Form {...careNoteForm}>
                            <form
                              className="mt-4 space-y-4"
                              onSubmit={handleCareNoteMessage}
                            >
                              <FormField
                                control={careNoteForm.control}
                                name="message"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ask The Assistant</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        className="min-h-[140px] rounded-3xl"
                                        placeholder="Rewrite this reminder so it sounds calmer and easier to understand for the patient."
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-xs text-muted-foreground">
                                  Set `OPENAI_API_KEY` in `.env.local` to enable live
                                  AI replies from the backend.
                                </p>
                                <Button
                                  type="submit"
                                  disabled={careNoteForm.formState.isSubmitting}
                                >
                                  {careNoteForm.formState.isSubmitting
                                    ? "Sending..."
                                    : "Send To Assistant"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </div>

                        <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                          <div className="mb-5 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky">
                              <ClipboardList className="h-7 w-7 text-foreground/70" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold">Routine</h2>
                              <p className="text-sm text-muted-foreground">
                                Caregiver and patient-added tasks appear together.
                              </p>
                            </div>
                          </div>

                          <Form {...taskForm}>
                            <form
                              className="grid gap-4 rounded-3xl bg-secondary/50 p-5 md:grid-cols-[1.3fr_1fr_160px]"
                              onSubmit={handleAddTask}
                            >
                              <FormField
                                control={taskForm.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Task Title</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Medication check-in"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={taskForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Note</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Short reminder or context"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={taskForm.control}
                                name="scheduledTime"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="time" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                className="md:col-span-3"
                                type="submit"
                                disabled={taskForm.formState.isSubmitting}
                              >
                                Add Caregiver Task
                              </Button>
                            </form>
                          </Form>

                          <div className="mt-5 space-y-3">
                            {routineTasks.length ? (
                              routineTasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="flex items-center justify-between gap-4 rounded-3xl bg-muted p-4"
                                >
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="font-semibold">{task.title}</p>
                                      <Badge
                                        variant={
                                          task.source === "patient"
                                            ? "secondary"
                                            : "outline"
                                        }
                                      >
                                        {task.source === "patient"
                                          ? "Patient Added"
                                          : "Caregiver Added"}
                                      </Badge>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {formatClockTime(task.scheduledTime)}
                                      {task.description ? ` • ${task.description}` : ""}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        task.status === "completed"
                                          ? "default"
                                          : "outline"
                                      }
                                    >
                                      {task.status === "completed"
                                        ? "Completed"
                                        : "Pending"}
                                    </Badge>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-10 w-10 rounded-2xl text-muted-foreground hover:text-destructive"
                                      disabled={pendingTaskDeleteId === task.id}
                                      onClick={() => void handleRemoveTask(task.id, task.title)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">
                                        Remove {task.title}
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-3xl bg-muted p-4 text-sm text-muted-foreground">
                                No routine tasks yet.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                          <div className="mb-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
                                <Pill className="h-7 w-7 text-foreground/70" />
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold">Medications</h2>
                                <p className="text-sm text-muted-foreground">
                                  Scheduled medications on the patient portal
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => setIsMedicationOpen(true)}
                              variant="outline"
                            >
                              Add Medication
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {medications.length ? (
                              medications.map((medication) => (
                                <div
                                  key={medication.id}
                                  className="rounded-3xl bg-muted p-4"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="font-semibold">{medication.name}</p>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant={
                                          medication.status === "taken"
                                            ? "default"
                                            : "outline"
                                        }
                                      >
                                        {medication.status === "taken"
                                          ? "Taken"
                                          : "Pending"}
                                      </Badge>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-2xl text-muted-foreground hover:text-destructive"
                                        disabled={pendingMedicationDeleteId === medication.id}
                                        onClick={() =>
                                          void handleRemoveMedication(
                                            medication.id,
                                            medication.name,
                                          )
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">
                                          Remove {medication.name}
                                        </span>
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    {medication.dosage} • {medication.instructions}
                                  </p>
                                  <p className="mt-3 text-sm font-medium">
                                    {formatClockTime(medication.scheduledTime)}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-3xl bg-muted p-4 text-sm text-muted-foreground">
                                No medications added yet.
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                          <div className="mb-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
                                <ShieldAlert className="h-7 w-7 text-destructive" />
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold">
                                  Emergency Contacts
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                  Shared with the patient portal
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => setIsContactOpen(true)}
                              variant="outline"
                            >
                              Add Contact
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {contacts.length ? (
                              contacts.map((contact) => (
                                <a
                                  key={contact.id}
                                  href={toTelHref(contact.phone)}
                                  className="flex items-center justify-between rounded-3xl bg-muted p-4 transition-colors hover:bg-muted/80"
                                >
                                  <div>
                                    <p className="font-semibold">{contact.name}</p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {contact.relationship} • {contact.phone}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={contact.isPrimary ? "default" : "outline"}
                                  >
                                    {contact.isPrimary ? "Primary" : "Call"}
                                  </Badge>
                                </a>
                              ))
                            ) : (
                              <div className="rounded-3xl bg-muted p-4 text-sm text-muted-foreground">
                                No emergency contacts added yet.
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                          <div className="mb-5 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warm/20">
                              <Bell className="h-7 w-7 text-warm" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold">
                                End Of Day Summary
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                The patient&apos;s saved day summary appears here.
                              </p>
                            </div>
                          </div>

                          <div className="rounded-3xl bg-muted p-4 text-sm leading-8 text-muted-foreground">
                            {patient.dailySummary ||
                              "The patient has not saved a summary yet."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-3xl border bg-card p-8 shadow-sm">
                    <p className="text-muted-foreground">
                      Select a patient to view linked data, contacts, medications,
                      and care notes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
          <DialogContent className="max-h-[92vh] max-w-5xl gap-0 overflow-hidden rounded-[2rem] p-0">
            <div className="flex max-h-[92vh] flex-col">
              <DialogHeader className="border-b px-6 py-5 md:px-8">
                <DialogTitle>Care Intake Assistant</DialogTitle>
                <DialogDescription>
                  Start a patient record by answering a few guided prompts. The
                  patient ID is generated automatically after intake.
                </DialogDescription>
              </DialogHeader>

              <div className="overflow-y-auto px-6 py-5 md:px-8">
                <Form {...addPatientForm}>
                  <form
                    className="grid gap-5 md:grid-cols-2"
                    onSubmit={handleAddPatient}
                  >
                    <FormField
                      control={addPatientForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Patient Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-12 rounded-xl"
                              placeholder="Enter the patient's name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addPatientForm.control}
                      name="supportLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Level</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
                            >
                              {supportLevelOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addPatientForm.control}
                      name="dementiaClassification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dementia Classification</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
                            >
                              {dementiaClassificationOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {[
                      {
                        name: "identitySummary" as const,
                        label:
                          "Prompt 1: How should the assistant describe the patient to them?",
                      },
                      {
                        name: "importantPeople" as const,
                        label: "Prompt 2: Who is this person close to?",
                      },
                      {
                        name: "preferences" as const,
                        label:
                          "Prompt 3: What routines or preferences should be remembered?",
                      },
                      {
                        name: "comfortNotes" as const,
                        label: "Prompt 4: What helps the patient feel calm or safe?",
                      },
                      {
                        name: "lifeStory" as const,
                        label:
                          "Prompt 5: What biography or memory details matter most?",
                      },
                    ].map((fieldMeta) => (
                      <FormField
                        key={fieldMeta.name}
                        control={addPatientForm.control}
                        name={fieldMeta.name}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>{fieldMeta.label}</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="min-h-[120px] rounded-3xl"
                                placeholder="Add the answer you want the assistant to remember."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                    <Button
                      className="md:col-span-2 h-14"
                      type="submit"
                      size="lg"
                      disabled={addPatientForm.formState.isSubmitting}
                    >
                      {addPatientForm.formState.isSubmitting
                        ? "Creating Patient..."
                        : "Create Patient And Generate ID"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isPatientDataOpen} onOpenChange={setIsPatientDataOpen}>
          <DialogContent className="max-h-[92vh] max-w-5xl gap-0 overflow-hidden rounded-[2rem] p-0">
            <div className="flex max-h-[92vh] flex-col">
              <DialogHeader className="border-b px-6 py-5 md:px-8">
                <DialogTitle>
                  {patient ? `${patient.name} • Patient Data` : "Patient Data"}
                </DialogTitle>
                <DialogDescription>
                  Review or edit the full patient profile, support level, and
                  memory details used by the assistant.
                </DialogDescription>
              </DialogHeader>

              <div className="overflow-y-auto px-6 py-5 md:px-8">
                <Form {...profileForm}>
                  <form className="space-y-5" onSubmit={handleProfileSave}>
                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={profileForm.control}
                        name="supportLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Support Profile</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
                              >
                                {supportLevelOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="dementiaClassification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dementia Classification</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
                              >
                                {dementiaClassificationOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {profileFields.map((fieldMeta) => (
                      <FormField
                        key={fieldMeta.name}
                        control={profileForm.control}
                        name={fieldMeta.name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{fieldMeta.label}</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="min-h-[130px] rounded-3xl"
                                placeholder={fieldMeta.placeholder}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                    <Button
                      className="h-14 w-full text-lg"
                      size="lg"
                      type="submit"
                      disabled={profileForm.formState.isSubmitting}
                    >
                      {profileForm.formState.isSubmitting
                        ? "Saving..."
                        : "Save Patient Data"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isMedicationOpen} onOpenChange={setIsMedicationOpen}>
          <DialogContent className="max-w-xl rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>Add Medication</DialogTitle>
              <DialogDescription>
                Add a medication that should appear on the patient portal.
              </DialogDescription>
            </DialogHeader>

            <Form {...medicationForm}>
              <form className="space-y-4" onSubmit={handleAddMedication}>
                <FormField
                  control={medicationForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Medication name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={medicationForm.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 1 tablet" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={medicationForm.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="With breakfast" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={medicationForm.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full"
                  type="submit"
                  disabled={medicationForm.formState.isSubmitting}
                >
                  {medicationForm.formState.isSubmitting
                    ? "Saving..."
                    : "Save Medication"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
          <DialogContent className="max-w-xl rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>
                Add a contact that the patient portal can call directly.
              </DialogDescription>
            </DialogHeader>

            <Form {...contactForm}>
              <form className="space-y-4" onSubmit={handleAddContact}>
                <FormField
                  control={contactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Contact name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+1 (555) 123-4567" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Daughter, spouse, clinician"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="isPrimary"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start gap-3 rounded-3xl bg-secondary/50 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(Boolean(checked))
                          }
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-semibold">
                          Primary contact
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Primary contacts are highlighted on the patient portal.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full"
                  type="submit"
                  disabled={contactForm.formState.isSubmitting}
                >
                  {contactForm.formState.isSubmitting
                    ? "Saving..."
                    : "Save Contact"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </section>
    </Layout>
  );
};

export default CaregiverDashboard;
