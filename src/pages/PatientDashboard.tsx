import Layout from "@/components/Layout";
import { Clock, Pill, Mic, MapPin, ShieldAlert, Sun, Moon } from "lucide-react";

const cards = [
  {
    icon: Sun,
    title: "Today",
    content: (
      <div className="space-y-3">
        <p className="text-lg font-medium">Good morning!</p>
        <ul className="space-y-2">
          <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-primary" /> Morning walk — 9:00 AM</li>
          <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-warm" /> Lunch — 12:30 PM</li>
          <li className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-primary" /> Afternoon rest — 2:00 PM</li>
        </ul>
      </div>
    ),
    color: "bg-sage",
  },
  {
    icon: Pill,
    title: "Medication",
    content: (
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-primary/10 rounded-xl p-4">
          <div>
            <p className="font-semibold text-lg">Aspirin</p>
            <p className="text-muted-foreground">1 tablet with water</p>
          </div>
          <span className="text-primary font-bold text-lg">2:00 PM</span>
        </div>
        <div className="flex items-center justify-between bg-sage rounded-xl p-4">
          <div>
            <p className="font-semibold text-lg">Vitamin D</p>
            <p className="text-muted-foreground">1 capsule</p>
          </div>
          <span className="text-primary font-bold text-lg">8:00 AM ✓</span>
        </div>
      </div>
    ),
    color: "bg-sky",
  },
  {
    icon: Mic,
    title: "Listen Again",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Tap to hear your last voice summary:</p>
        <button className="w-full bg-primary/10 rounded-xl p-5 flex items-center gap-4 hover:bg-primary/15 transition-colors">
          <Mic className="w-8 h-8 text-primary" />
          <div className="text-left">
            <p className="font-semibold text-lg">Morning Summary</p>
            <p className="text-muted-foreground">Recorded at 9:15 AM</p>
          </div>
        </button>
      </div>
    ),
    color: "bg-accent",
  },
  {
    icon: MapPin,
    title: "Important Places",
    content: (
      <div className="space-y-3">
        {["Home — 123 Oak Street", "Pharmacy — Main & 5th", "Park — Riverside Walk"].map((place) => (
          <div key={place} className="flex items-center gap-3 bg-sage rounded-xl p-4">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-lg">{place}</span>
          </div>
        ))}
      </div>
    ),
    color: "bg-sage",
  },
  {
    icon: ShieldAlert,
    title: "Help / SOS",
    content: (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground text-lg">Need help right now?</p>
        <button className="w-full bg-destructive text-destructive-foreground rounded-xl p-5 text-xl font-bold hover:opacity-90 transition-opacity">
          Call for Help
        </button>
        <p className="text-muted-foreground">This will alert Sarah and Dr. Smith</p>
      </div>
    ),
    color: "bg-destructive/10",
  },
];

const PatientDashboard = () => (
  <Layout>
    <section className="py-10 md:py-16 px-4">
      <div className="container mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-muted-foreground text-lg">Hello,</p>
          <h1 className="text-section-sm md:text-section font-heading">Welcome back, Margaret</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Moon className="w-5 h-5" />
            <span>Thursday, April 4 — Afternoon</span>
          </div>
        </div>

        <div className="space-y-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-foreground/70" />
                </div>
                <h2 className="text-xl font-heading font-bold">{card.title}</h2>
              </div>
              {card.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default PatientDashboard;
