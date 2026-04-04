import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";

const Download = () => (
  <Layout>
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-3xl space-y-10">
        <div className="space-y-4 text-center">
          <h1 className="font-heading text-section-sm md:text-section">
            Download Memento
          </h1>
          <p className="mx-auto max-w-xl text-body-lg text-muted-foreground">
            The mobile app is still in development. You can use the web app today
            while the iOS and Android release is being prepared.
          </p>
          <Button asChild size="lg">
            <Link to="/auth">Open The Web App</Link>
          </Button>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm md:p-10">
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <h2 className="font-heading text-xl font-bold">Mobile App</h2>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Native iOS and Android downloads are not published yet. The
                download control stays disabled until the first mobile release is
                ready.
              </p>
            </div>

            <Button size="lg" className="w-full max-w-sm" disabled>
              Download Mobile App
            </Button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Download;
