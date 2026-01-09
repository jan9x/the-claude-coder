import { NewsletterForm } from "./NewsletterForm";

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 text-center" id="newsletter">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
          Level up your coding with{" "}
          <span className="text-primary-500">Claude</span>
        </h1>

        <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Weekly insights on AI-assisted development, practical tutorials, and
          tips for shipping better code faster.
        </p>

        <NewsletterForm />

        <p className="mt-6 text-sm text-neutral-500">
          Join developers getting smarter about AI coding. No spam, unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
