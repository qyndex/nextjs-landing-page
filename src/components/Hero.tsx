import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailSignup } from "@/components/EmailSignup";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Gradient background blobs */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            background: "linear-gradient(to top right, var(--brand-primary), var(--brand-secondary), var(--brand-accent))",
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            background: "linear-gradient(to top right, var(--brand-accent), var(--brand-primary))",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        {/* Social proof badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-muted-foreground">
              Trusted by <strong className="text-foreground">10,000+</strong> teams worldwide
            </span>
          </div>
        </div>

        {/* Headline with shimmer gradient */}
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl leading-[1.08]">
          {/* PLACEHOLDER: Replace Build something amazing with your main headline */}
          <span className="block">Build something amazing</span>
          <span className="block mt-2 gradient-text shimmer-bg">in record time.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-8 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
          {/* PLACEHOLDER: Replace The modern platform for teams who ship fast. with your product description */}
          The modern platform for teams who ship fast.
        </p>

        {/* Primary CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-12 px-8 text-base bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white border-0 hover:opacity-90 transition-opacity shadow-lg shadow-[var(--brand-primary)]/25"
            asChild
          >
            {/* PLACEHOLDER: Replace Get Started with your call-to-action */}
            <Link href="#signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="#demo">Watch demo</Link>
          </Button>
        </div>

        {/* Email signup */}
        <div className="mt-12 max-w-md mx-auto">
          <EmailSignup />
          <p className="mt-3 text-xs text-muted-foreground">
            No credit card required. Free 14-day trial.
          </p>
        </div>

        {/* Hero image placeholder */}
        <div className="mt-16 relative">
          <div className="glass rounded-2xl p-1 shadow-2xl shadow-black/20">
            <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center overflow-hidden">
              <div className="text-muted-foreground/40 text-sm font-mono">
                [ product screenshot / demo GIF ]
              </div>
            </div>
          </div>
          {/* Glow effect under image */}
          <div
            className="absolute -bottom-8 inset-x-12 h-16 blur-2xl opacity-40 rounded-full"
            style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-secondary))" }}
          />
        </div>
      </div>
    </section>
  );
}
