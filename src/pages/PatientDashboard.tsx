import { Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookUser,
  Bot,
  CalendarClock,
  CheckCircle2,
  KeyRound,
  Mic,
  Phone,
  Pill,
  ShieldAlert,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMemento } from "@/context/MementoContext";
import { toast } from "@/hooks/use-toast";
import {
  formatClockTime,
  formatDementiaClassification,
  formatSupportLevel,
  toTelHref,
} from "@/lib/memento-utils";

const taskSchema = z.object({
  title: z.string().trim().min(2, "Enter a task title."),
  description: z.string().trim().max(180, "Keep the note under 180 characters."),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, "Select a valid time."),
});

const summarySchema = z.object({
  dailySummary: z
    .string()
    .trim()
    .min(10, "Add a short summary for the day.")
    .max(1200, "Keep the summary under 1200 characters."),
});

const assistantSchema = z.object({
  message: z.string().trim().min(2, "Enter a question or message for the assistant."),
});

type TaskValues = z.infer<typeof taskSchema>;
type SummaryValues = z.infer<typeof summarySchema>;
type AssistantValues = z.infer<typeof assistantSchema>;

const PatientDashboard = () => {
  const {
    currentRole,
    activePatientBundle,
    addRoutineTask,
    toggleMedicationStatus,
    toggleRoutineTaskStatus,
    updateDailySummary,
    sendAssistantMessage,
    sendEmergencyAlert,
  } = useMemento();

  const taskForm = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      scheduledTime: "",
    },
  });

  const summaryForm = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      dailySummary: "",
    },
  });

  const assistantForm = useForm<AssistantValues>({
    resolver: zodResolver(assistantSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (activePatientBundle) {
      summaryForm.reset({
        dailySummary: activePatientBundle.patient.dailySummary,
      });
    }
  }, [activePatientBundle, summaryForm]);

  if (!currentRole) {
    return <Navigate to="/auth" replace />;
  }

  if (currentRole === "caregiver") {
    return <Navigate to="/caregiver-dashboard" replace />;
  }

  if (!activePatientBundle) {
    return (
      <Layout>
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-3xl rounded-3xl border bg-card p-8 shadow-sm">
            <p className="text-muted-foreground">Loading your patient dashboard...</p>
          </div>
        </section>
      </Layout>
    );
  }

  const { patient, profile, caregiver, routine, medications, contacts, assistantMessages } = activePatientBundle;
  const hasEmergencyContacts = contacts.length > 0;
  const latestAssistantReply = [...assistantMessages].reverse().find((message) => message.sender === "assistant");

  const speakAssistantReply = () => {
    const responseText = latestAssistantReply?.content || profile.assistantBrief || profile.identitySummary;

    if (!responseText) {
      toast({
        title: "Nothing to read yet",
        description: "Ask the assistant a question first.",
        variant: "destructive",
      });
      return;
    }

    if (!("speechSynthesis" in window)) {
      toast({
        title: "Speech unavailable",
        description: "This browser does not support spoken playback.",
        variant: "destructive",
      });
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(responseText));
  };

  const handleAddTask = taskForm.handleSubmit(async (values) => {
    try {
      await addRoutineTask(patient.id, values, "patient");
      toast({
        title: "Task added",
        description: "Your caregiver will see the task in their dashboard.",
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

  const handleSaveSummary = summaryForm.handleSubmit(async (values) => {
    try {
      await updateDailySummary(patient.id, values.dailySummary);
      toast({
        title: "Summary saved",
        description: "Your caregiver can now review today's summary.",
      });
    } catch (error) {
      toast({
        title: "Unable to save summary",
        description: error instanceof Error ? error.message : "Summary could not be saved.",
        variant: "destructive",
      });
    }
  });

  const handleAssistantMessage = assistantForm.handleSubmit(async (values) => {
    try {
      const bundle = await sendAssistantMessage(patient.id, values.message);
      const latestReply = [...bundle.assistantMessages].reverse().find((message) => message.sender === "assistant");

      assistantForm.reset();

      if (latestReply && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(latestReply.content));
      }
    } catch (error) {
      toast({
        title: "Assistant unavailable",
        description: error instanceof Error ? error.message : "The assistant could not respond.",
        variant: "destructive",
      });
    }
  });

  const handleEmergencyAlert = async () => {
    try {
      await sendEmergencyAlert(patient.id, "patient");
      toast({
        title: "Emergency alert sent",
        description: `${caregiver.name} has been notified.`,
      });
    } catch (error) {
      toast({
        title: "Unable to send alert",
        description: error instanceof Error ? error.message : "The SOS alert could not be sent.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <section className="px-4 py-10 md:py-16">
        <div className="container mx-auto max-w-6xl space-y-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-lg text-muted-foreground">Welcome back,</p>
                <Badge variant="secondary">{formatSupportLevel(patient.supportLevel)}</Badge>
                <Badge variant="outline">
                  {formatDementiaClassification(patient.dementiaClassification)}
                </Badge>
              </div>
            <h1 className="font-heading text-section-sm md:text-section">{patient.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                <span>{patient.patientLoginId}</span>
              </div>
              <span>Caregiver: {caregiver.name}</span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage">
                    <BookUser className="h-6 w-6 text-foreground/70" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">About You</h2>
                    <p className="text-sm text-muted-foreground">
                      Information your caregiver saved for the assistant.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-sm font-semibold text-muted-foreground">Identity</p>
                    <p className="mt-2">{profile.identitySummary || "No identity notes added yet."}</p>
                  </div>
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-sm font-semibold text-muted-foreground">Important People</p>
                    <p className="mt-2">{profile.importantPeople || "No important people have been added yet."}</p>
                  </div>
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-sm font-semibold text-muted-foreground">Preferences</p>
                    <p className="mt-2">{profile.preferences || "No preferences saved yet."}</p>
                  </div>
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-sm font-semibold text-muted-foreground">Comfort Notes</p>
                    <p className="mt-2">{profile.comfortNotes || "No comfort notes saved yet."}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky">
                    <CalendarClock className="h-6 w-6 text-foreground/70" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Today's Routine</h2>
                    <p className="text-sm text-muted-foreground">
                      You can add tasks and your caregiver will see them.
                    </p>
                  </div>
                </div>

                <Form {...taskForm}>
                  <form className="grid gap-4 rounded-2xl bg-secondary/50 p-5 md:grid-cols-[1fr_1fr_150px] md:items-end" onSubmit={handleAddTask}>
                    <FormField
                      control={taskForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Call my daughter" />
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
                            <Input {...field} placeholder="Optional note for today" />
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
                    <Button className="md:col-span-3" type="submit" disabled={taskForm.formState.isSubmitting}>
                      Add To My Day
                    </Button>
                  </form>
                </Form>

                <div className="mt-5 space-y-3">
                  {routine.tasks.length ? (
                    routine.tasks.map((task) => (
                      <label key={task.id} className="flex items-start gap-4 rounded-2xl bg-muted p-4">
                        <Checkbox
                          checked={task.status === "completed"}
                          onCheckedChange={() => void toggleRoutineTaskStatus(task.id)}
                          className="mt-1 h-5 w-5"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{task.title}</p>
                            <Badge variant={task.source === "patient" ? "secondary" : "outline"}>
                              {task.source === "patient" ? "I Added This" : "Caregiver Added"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatClockTime(task.scheduledTime)}
                            {task.description ? ` • ${task.description}` : ""}
                          </p>
                        </div>
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : null}
                      </label>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                      No routine tasks yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
                    <Bot className="h-6 w-6 text-foreground/70" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Memento Assistant</h2>
                    <p className="text-sm text-muted-foreground">
                      Ask who you are, what is scheduled today, or who is important to you.
                    </p>
                  </div>
                </div>

                <div className="max-h-[320px] space-y-3 overflow-y-auto rounded-2xl bg-secondary/40 p-4">
                  {assistantMessages.length ? (
                    assistantMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`rounded-2xl p-4 ${
                          message.sender === "assistant"
                            ? "bg-card"
                            : "ml-auto max-w-[85%] bg-primary/10"
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {message.sender === "assistant" ? "Assistant" : "You"}
                        </p>
                        <p className="mt-2">{message.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-card p-4 text-sm text-muted-foreground">
                      Ask the assistant something like "Who am I?" or "What do I need to do today?"
                    </div>
                  )}
                </div>

                <Form {...assistantForm}>
                  <form className="mt-4 space-y-4" onSubmit={handleAssistantMessage}>
                    <FormField
                      control={assistantForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ask The Assistant</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[110px] rounded-2xl"
                              placeholder="Who am I? What is planned for today?"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" disabled={assistantForm.formState.isSubmitting}>
                        {assistantForm.formState.isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                      <Button type="button" variant="outline" onClick={speakAssistantReply}>
                        <Mic className="mr-2 h-4 w-4" />
                        Read Latest Reply
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Pill className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Medications</h2>
                    <p className="text-sm text-muted-foreground">
                      Scheduled by your caregiver
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {medications.length ? (
                    medications.map((medication) => (
                      <label key={medication.id} className="flex items-start gap-4 rounded-2xl bg-muted p-4">
                        <Checkbox
                          checked={medication.status === "taken"}
                          onCheckedChange={() => void toggleMedicationStatus(medication.id)}
                          className="mt-1 h-5 w-5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold">{medication.name}</p>
                            <Badge variant={medication.status === "taken" ? "default" : "outline"}>
                              {medication.status === "taken" ? "Taken" : "Pending"}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {medication.dosage} • {medication.instructions}
                          </p>
                          <p className="mt-2 text-sm font-medium">{formatClockTime(medication.scheduledTime)}</p>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                      No medications scheduled yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
                    <Phone className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Emergency Contacts</h2>
                    <p className="text-sm text-muted-foreground">
                      Tap any contact to place a call.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {contacts.length ? (
                    contacts.map((contact) => (
                      <a
                        key={contact.id}
                        href={toTelHref(contact.phone)}
                        className="flex items-center justify-between rounded-2xl bg-muted p-4 transition-colors hover:bg-muted/80"
                      >
                        <div>
                          <p className="font-semibold">{contact.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {contact.relationship} • {contact.phone}
                          </p>
                        </div>
                        <Badge variant={contact.isPrimary ? "default" : "outline"}>
                          {contact.isPrimary ? "Primary" : "Call"}
                        </Badge>
                      </a>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                      No emergency contacts have been added yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warm/20">
                    <ShieldAlert className="h-6 w-6 text-warm" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">End Of Day Summary</h2>
                    <p className="text-sm text-muted-foreground">
                      Save a short summary so your caregiver can keep track of the day.
                    </p>
                  </div>
                </div>

                <Form {...summaryForm}>
                  <form className="space-y-4" onSubmit={handleSaveSummary}>
                    <FormField
                      control={summaryForm.control}
                      name="dailySummary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Today's Summary</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[160px] rounded-2xl"
                              placeholder="Write down what you did today, how you felt, or anything you want your caregiver to remember."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="w-full" type="submit" disabled={summaryForm.formState.isSubmitting}>
                      {summaryForm.formState.isSubmitting ? "Saving..." : "Save My Day Summary"}
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="rounded-3xl border bg-card p-6 text-center shadow-sm md:p-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
                  <ShieldAlert className="h-7 w-7 text-destructive" />
                </div>
                <h2 className="text-xl font-bold">Need Help Right Now?</h2>
                <p className="mt-3 text-muted-foreground">
                  Send an alert to your caregiver and emergency workflow.
                </p>
                <Button
                  className="mt-6 w-full bg-destructive py-6 text-lg text-destructive-foreground hover:bg-destructive/90"
                  disabled={!hasEmergencyContacts}
                  onClick={() => void handleEmergencyAlert()}
                  size="lg"
                >
                  Call For Help
                </Button>
                <p className="mt-4 text-sm text-muted-foreground">
                  {hasEmergencyContacts
                    ? "This alerts your caregiver and keeps the contact list ready."
                    : "Ask your caregiver to add at least one emergency contact first."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PatientDashboard;
