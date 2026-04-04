import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Pill, Mic, CalendarClock, FileText, ShieldAlert, MapPin,
  UserPlus, Settings2, Bell, Heart, Users, ArrowRight,
  Smartphone, Monitor, Mail, ChevronRight, Clock, Phone
} from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";
import familyImage from "@/assets/family-connection.jpg";

const features = [
  { icon: Pill, title: "Medication Reminders", desc: "Never miss a dose. Gentle, timely reminders that keep you on track with your medication.", color: "bg-sage" },
  { icon: Mic, title: "AI Voice Assistant", desc: "Ask questions, get reminders read aloud, or just have a calm conversation.", color: "bg-sky" },
  { icon: CalendarClock, title: "Routine Scheduler", desc: "Build a daily routine that brings structure and comfort to every day.", color: "bg-accent" },
  { icon: FileText, title: "Daily Logs & Summaries", desc: "A simple overview of your day — what happened, what's next, and how you're doing.", color: "bg-sage" },
  { icon: ShieldAlert, title: "Emergency Help Flow", desc: "Quick access to emergency contacts and SOS alerts when you need help fast.", color: "bg-destructive/10" },
  { icon: MapPin, title: "Important Places", desc: "Save your favorite and important places so you always know how to get there.", color: "bg-sky" },
];

const steps = [
  { num: "1", title: "Create Your Profile", desc: "Set up a simple profile for yourself or your loved one." },
  { num: "2", title: "Choose Support Level", desc: "Pick from Early, Middle, or Late support to match your needs." },
  { num: "3", title: "Set Up Your Routine", desc: "Add reminders, medication schedules, and important places." },
  { num: "4", title: "Stay Connected", desc: "Invite up to 3 family members or caregivers to help." },
];

const profiles = [
  { title: "Early Support", desc: "Light guidance with gentle reminders and routine suggestions. The interface stays full-featured with optional prompts.", color: "bg-sage" },
  { title: "Middle Support", desc: "More frequent reminders, simplified navigation, and proactive check-ins throughout the day.", color: "bg-sky" },
  { title: "Late Support", desc: "Maximum simplicity with large buttons, voice guidance, and automatic caregiver alerts.", color: "bg-accent" },
];

const portalCards = [
  { icon: Clock, title: "Today's Routine", desc: "Morning walk, lunch, afternoon rest" },
  { icon: Pill, title: "Medication Reminder", desc: "Take Aspirin at 2:00 PM" },
  { icon: Mic, title: "AI Voice Prompt", desc: "'Good morning! Ready for your day?'" },
  { icon: MapPin, title: "Important Places", desc: "Home, Pharmacy, Park" },
  { icon: Phone, title: "Emergency Contacts", desc: "Sarah (daughter), Dr. Smith" },
  { icon: FileText, title: "Daily Summary", desc: "3 tasks done, 1 reminder left" },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-hero-sm md:text-hero font-heading text-foreground">
            Gentle support for{" "}
            <span className="text-primary">memory</span>, routine, and{" "}
            <span className="text-primary">peace of mind</span>.
          </h1>
          <p className="text-body-lg text-muted-foreground max-w-lg">
            Helping people with dementia stay connected, supported, and safe — with simple reminders, calm guidance, and family support when it matters.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/auth?mode=signup">Get Started <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/download">Download App</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={heroImage} alt="An elderly person using a tablet with a simple, friendly interface in a comfortable living room" width={1280} height={800} className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>

    {/* Who it's for */}
    <section className="py-16 bg-secondary/30 px-4">
      <div className="container mx-auto text-center space-y-12">
        <h2 className="text-section-sm md:text-section">Built for everyone who cares</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Heart, title: "Patients", desc: "Simple, calming tools that bring comfort and structure to your day." },
            { icon: Users, title: "Family Members", desc: "Stay connected, receive updates, and support your loved one from anywhere." },
            { icon: Settings2, title: "Caregivers", desc: "Manage routines, medications, and emergencies with clarity and ease." },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-2xl p-8 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 px-4" id="features">
      <div className="container mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-section-sm md:text-section">Everything you need, nothing you don't</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">Simple, thoughtful features designed for clarity and comfort.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow space-y-4 border">
              <div className={`w-14 h-14 rounded-xl ${f.color} flex items-center justify-center`}>
                <f.icon className="w-7 h-7 text-foreground/70" />
              </div>
              <h3 className="text-xl font-heading font-semibold">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-20 bg-secondary/30 px-4">
      <div className="container mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-section-sm md:text-section">How Memento works</h2>
          <p className="text-body-lg text-muted-foreground">Getting started is simple and takes just a few minutes.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((s) => (
            <div key={s.num} className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto">
                {s.num}
              </div>
              <h3 className="text-lg font-heading font-semibold">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Support profiles */}
    <section className="py-20 px-4">
      <div className="container mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-section-sm md:text-section">Support that adapts to you</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a support profile that matches your needs. You can change it anytime.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {profiles.map((p) => (
            <div key={p.title} className={`rounded-2xl p-8 ${p.color} space-y-4 border`}>
              <h3 className="text-xl font-heading font-bold">{p.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Family & caregivers */}
    <section className="py-20 bg-secondary/30 px-4">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img src={familyImage} alt="Three generations of a family connected through glowing lines, representing care and support" width={1024} height={768} loading="lazy" className="w-full h-auto" />
        </div>
        <div className="space-y-6">
          <h2 className="text-section-sm md:text-section">Family stays connected</h2>
          <p className="text-body-lg text-muted-foreground">
            Caregivers and family members play a vital role. Memento makes it easy to stay involved.
          </p>
          <ul className="space-y-4">
            {[
              "Help manage reminders and medication schedules",
              "Receive SMS alerts for emergencies",
              "Review daily summaries and activity logs",
              "Connect up to 3 family members or caregivers",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <ChevronRight className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* Download */}
    <section className="py-20 px-4" id="download">
      <div className="container mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-section-sm md:text-section">Download Memento</h2>
          <p className="text-body-lg text-muted-foreground">Available on mobile and desktop. Take Memento wherever you go.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl p-10 shadow-sm border space-y-4">
            <Smartphone className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-xl font-heading font-semibold">Mobile App</h3>
            <p className="text-muted-foreground">For iOS and Android</p>
            <Button size="lg" className="w-full text-lg py-6">Download Mobile</Button>
          </div>
          <div className="bg-card rounded-2xl p-10 shadow-sm border space-y-4">
            <Monitor className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-xl font-heading font-semibold">Desktop App</h3>
            <p className="text-muted-foreground">For Windows and macOS</p>
            <Button size="lg" variant="outline" className="w-full text-lg py-6">Download Desktop</Button>
          </div>
        </div>
      </div>
    </section>

    {/* Portal preview */}
    <section className="py-20 bg-secondary/30 px-4">
      <div className="container mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-section-sm md:text-section">A peek inside your dashboard</h2>
          <p className="text-body-lg text-muted-foreground">Simple, friendly, and designed for comfort.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {portalCards.map((c) => (
            <div key={c.title} className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border space-y-3">
              <c.icon className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-heading font-semibold">{c.title}</h3>
              <p className="text-muted-foreground text-sm md:text-base">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Contact */}
    <section className="py-20 px-4" id="contact">
      <div className="container mx-auto max-w-2xl space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-section-sm md:text-section">We're here to help</h2>
          <p className="text-body-lg text-muted-foreground">
            Have questions? Need assistance? Our support team is always ready to help you and your family.
          </p>
        </div>
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border space-y-6">
          <div className="flex items-center gap-3 text-lg text-muted-foreground">
            <Mail className="w-6 h-6 text-primary" />
            <span>support@memento.app</span>
          </div>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-lg font-medium mb-2">Your Name</label>
              <input id="name" type="text" className="w-full rounded-xl border bg-background px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium mb-2">Email Address</label>
              <input id="email" type="email" className="w-full rounded-xl border bg-background px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your email" />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg font-medium mb-2">Message</label>
              <textarea id="message" rows={4} className="w-full rounded-xl border bg-background px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="How can we help?" />
            </div>
            <Button size="lg" className="w-full text-lg py-6">Send Message</Button>
          </form>
          <p className="text-center text-muted-foreground text-sm">
            Memento is designed with accessibility and family support at its core. We're here for you.
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
