import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Apple, Globe } from "lucide-react";

const downloads = [
  {
    icon: Smartphone,
    title: "Mobile App",
    desc: "Take Memento with you wherever you go. Available for iOS and Android.",
    items: [
      { label: "Download for iOS", sub: "iPhone & iPad", icon: Apple },
      { label: "Download for Android", sub: "Android phones & tablets", icon: Globe },
    ],
  },
  {
    icon: Monitor,
    title: "Desktop App",
    desc: "Use Memento on your computer with a larger, easier-to-read screen.",
    items: [
      { label: "Download for Windows", sub: "Windows 10 and later", icon: Monitor },
      { label: "Download for macOS", sub: "macOS 12 and later", icon: Apple },
    ],
  },
];

const Download = () => (
  <Layout>
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-3xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-section-sm md:text-section font-heading">Download Memento</h1>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            Get Memento on your favorite device. Simple to install, easy to use.
          </p>
        </div>

        <div className="space-y-8">
          {downloads.map((d) => (
            <div key={d.title} className="bg-card rounded-2xl p-8 md:p-10 shadow-sm border space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <d.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold">{d.title}</h2>
                  <p className="text-muted-foreground">{d.desc}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {d.items.map((item) => (
                  <Button key={item.label} size="lg" variant="outline" className="h-auto py-5 px-6 flex items-center gap-4 justify-start text-left">
                    <item.icon className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <div className="text-lg font-semibold">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.sub}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Download;
