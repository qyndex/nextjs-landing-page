import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$19",
    period: "per month",
    description: "Perfect for indie hackers and small projects.",
    features: [
      "5 projects",
      "10 GB storage",
      "Basic analytics",
      "Community support",
      "Custom domain",
    ],
    cta: "Start free trial",
    href: "#signup",
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "Everything growing teams need to move fast.",
    popular: true,
    features: [
      "Unlimited projects",
      "100 GB storage",
      "Advanced analytics",
      "Priority support (< 4h SLA)",
      "Custom domains",
      "Team collaboration",
      "API access",
    ],
    cta: "Start free trial",
    href: "#signup",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "per month",
    description: "Dedicated infrastructure and white-glove support.",
    features: [
      "Everything in Pro",
      "1 TB storage",
      "SSO / SAML",
      "Audit logs",
      "Dedicated account manager",
      "Custom SLA",
      "On-premise option",
    ],
    cta: "Talk to sales",
    href: "#contact",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest gradient-text mb-3">
            Pricing
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No hidden fees. Cancel anytime. Start free for 14 days on any plan.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border bg-background p-8 shadow-sm",
                plan.popular
                  ? "border-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/10 ring-1 ring-[var(--brand-primary)]"
                  : "border-border"
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    <Sparkles className="h-3 w-3" /> Most popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className="h-4 w-4 mt-0.5 shrink-0"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full mt-8",
                  plan.popular
                    ? "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white border-0 hover:opacity-90"
                    : ""
                )}
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Have questions?{" "}
          <Link href="#faq" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Read our FAQ
          </Link>{" "}
          or{" "}
          <Link href="#contact" className="underline underline-offset-4 hover:text-foreground transition-colors">
            contact us
          </Link>.
        </p>
      </div>
    </section>
  );
}
