import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailSignup } from "@/components/EmailSignup";

export function CTA() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 8%, transparent), color-mix(in srgb, var(--brand-secondary) 8%, transparent))",
        }}
      />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, currentColor, currentColor 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, currentColor, currentColor 1px, transparent 1px, transparent 60px)",
        }}
      />

      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Ready to ship your
          <span className="block gradient-text">next big thing?</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          {/* PLACEHOLDER: Replace Get Started with your call-to-action message */}
          Join thousands of teams building with Acme.
          Start your free 14-day trial — no credit card required.
        </p>

        {/* Email signup */}
        <div className="mt-10 max-w-md mx-auto">
          <EmailSignup />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-12 px-8 text-base bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white border-0 hover:opacity-90 transition-opacity shadow-lg"
            asChild
          >
            {/* PLACEHOLDER: Replace Get Started */}
            <Link href="#signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="#demo">See how it works</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="#login" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
