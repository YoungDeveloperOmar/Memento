import Layout from "@/components/Layout";

const Accessibility = () => (
  <Layout>
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-primary">Support</p>
          <h1 className="font-heading text-section-sm md:text-section">Accessibility</h1>
          <p className="text-body-lg text-muted-foreground">
            Memento is built for clarity, low-friction navigation, and calm daily
            support for dementia care.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border bg-card p-8 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Design Priorities</h2>
            <p className="text-muted-foreground">
              The interface uses large touch targets, high-contrast structure,
              simple navigation, and support-level-specific guidance so the patient
              experience can stay as calm as possible.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">Voice And Text Support</h2>
            <p className="text-muted-foreground">
              Patients can use the assistant through a simple chat interface, and
              spoken playback is available through browser speech synthesis when the
              device supports it.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">Caregiver Control</h2>
            <p className="text-muted-foreground">
              Caregivers can tune support levels, update memory prompts, and manage
              contacts and medications without exposing those management controls in
              the patient portal.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">Ongoing Improvement</h2>
            <p className="text-muted-foreground">
              Accessibility feedback should be treated as product-critical. The app
              is intended to evolve with further testing on real devices and with
              caregivers and patients in the loop.
            </p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Accessibility;
