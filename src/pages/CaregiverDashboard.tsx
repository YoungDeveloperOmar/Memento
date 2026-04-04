import Layout from "@/components/Layout";
import { Users, Pill, Settings2, ShieldAlert, FileText, Heart, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CaregiverDashboard = () => (
  <Layout>
    <section className="py-10 md:py-16 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <p className="text-muted-foreground text-lg">Caregiver Portal</p>
          <h1 className="text-section-sm md:text-section font-heading">Hello, Sarah</h1>
          <p className="text-muted-foreground">You're caring for <strong>Margaret</strong> — Early Support</p>
        </div>

        {/* Patient overview */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-heading font-bold">Patient Overview</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Today's Tasks", value: "4 of 6 done", color: "bg-sage" },
              { label: "Medications", value: "1 upcoming", color: "bg-sky" },
              { label: "Mood", value: "Calm & content", color: "bg-accent" },
            ].map((s) => (
              <div key={s.label} className={`${s.color} rounded-xl p-5 space-y-1`}>
                <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                <p className="text-lg font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Reminder setup */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky flex items-center justify-center">
                <Pill className="w-6 h-6 text-foreground/70" />
              </div>
              <h2 className="text-xl font-heading font-bold">Medication Setup</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: "Aspirin", time: "2:00 PM", status: "Pending" },
                { name: "Vitamin D", time: "8:00 AM", status: "Taken ✓" },
              ].map((med) => (
                <div key={med.name} className="flex items-center justify-between bg-muted rounded-xl p-4">
                  <div>
                    <p className="font-semibold">{med.name}</p>
                    <p className="text-sm text-muted-foreground">{med.time}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{med.status}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">Add Medication</Button>
          </div>

          {/* Support profile */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Settings2 className="w-6 h-6 text-foreground/70" />
              </div>
              <h2 className="text-xl font-heading font-bold">Support Profile</h2>
            </div>
            <div className="space-y-3">
              {["Early Support", "Middle Support", "Late Support"].map((level, i) => (
                <button key={level} className={`w-full text-left rounded-xl p-4 border-2 transition-all flex items-center justify-between ${
                  i === 0 ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}>
                  <span className="font-medium text-lg">{level}</span>
                  {i === 0 && <span className="text-sm text-primary font-semibold">Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency contacts */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-xl font-heading font-bold">Emergency Contacts</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: "Sarah (You)", phone: "+1 555-0123", role: "Primary" },
                { name: "Dr. Smith", phone: "+1 555-0456", role: "Doctor" },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between bg-muted rounded-xl p-4">
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.phone}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{c.role}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">Add Contact</Button>
          </div>

          {/* Daily logs */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center">
                <FileText className="w-6 h-6 text-foreground/70" />
              </div>
              <h2 className="text-xl font-heading font-bold">Daily Logs</h2>
            </div>
            <div className="space-y-3">
              {[
                { date: "Today", summary: "4 tasks completed, 1 reminder pending" },
                { date: "Yesterday", summary: "All tasks completed, good day" },
                { date: "April 2", summary: "Missed afternoon medication" },
              ].map((log) => (
                <div key={log.date} className="flex items-center justify-between bg-muted rounded-xl p-4">
                  <div>
                    <p className="font-semibold">{log.date}</p>
                    <p className="text-sm text-muted-foreground">{log.summary}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connected family */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky flex items-center justify-center">
              <Users className="w-6 h-6 text-foreground/70" />
            </div>
            <h2 className="text-xl font-heading font-bold">Connected Family Members</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Sarah (You)", role: "Primary Caregiver" },
              { name: "James", role: "Family Member" },
              { name: "Invite someone", role: "1 spot remaining", empty: true },
            ].map((m) => (
              <div key={m.name} className={`rounded-xl p-5 text-center space-y-2 ${
                m.empty ? "border-2 border-dashed border-border" : "bg-muted"
              }`}>
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                  m.empty ? "bg-muted" : "bg-primary/10"
                }`}>
                  <Users className={`w-6 h-6 ${m.empty ? "text-muted-foreground" : "text-primary"}`} />
                </div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-warm/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-warm" />
            </div>
            <h2 className="text-xl font-heading font-bold">Recent Alerts</h2>
          </div>
          <div className="space-y-3">
            {[
              { text: "Margaret completed her morning routine", time: "2 hours ago" },
              { text: "Afternoon medication reminder sent", time: "30 minutes ago" },
              { text: "Daily summary is ready to review", time: "Just now" },
            ].map((alert) => (
              <div key={alert.text} className="flex items-center justify-between bg-muted rounded-xl p-4">
                <p className="font-medium">{alert.text}</p>
                <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default CaregiverDashboard;
