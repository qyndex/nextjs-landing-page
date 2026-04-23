import { Zap, Shield, BarChart3, Globe, Clock, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Zap,
    name: "Lightning Fast",
    description:
      "Optimized for speed with edge-first architecture and smart caching. P99 latency under 50ms globally.",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: Shield,
    name: "Secure by Default",
    description:
      "Enterprise-grade security with SOC 2 Type II compliance, end-to-end encryption, and SSO/SAML support.",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    icon: BarChart3,
    name: "Real-time Analytics",
    description:
      "Track every metric that matters. Funnel analysis, retention cohorts, and custom dashboards out of the box.",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    icon: Globe,
    name: "Global CDN",
    description:
      "Deploy to 300+ edge locations worldwide for blazing fast load times — no DevOps required.",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    icon: Clock,
    name: "Ship in Days",
    description:
      "Battle-tested boilerplate eliminates weeks of setup. Focus on features that actually differentiate your product.",
    gradient: "from-cyan-400 to-sky-500",
  },
  {
    icon: HeartHandshake,
    name: "World-class Support",
    description:
      "Dedicated Slack channel, SLA-backed response times, and a team that genuinely cares about your success.",
    gradient: "from-rose-400 to-red-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest gradient-text mb-3">
            Why teams choose us
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to ship faster
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We handle the infrastructure complexity so you can focus on building
            the product your customers love.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.name}
              className="group relative rounded-2xl border border-border/60 bg-background p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              {/* Icon with gradient background */}
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} mb-4 shadow-sm`}
              >
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ring-inset ring-[var(--brand-primary)]/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
