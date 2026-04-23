import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO",
    company: "TechCorp",
    avatar: "SC",
    avatarGradient: "from-violet-400 to-purple-600",
    rating: 5,
    text: "This platform cut our development time in half. We went from idea to production in two weeks — something that would have taken months before.",
  },
  {
    name: "Marcus Johnson",
    role: "Founder",
    company: "StartupXYZ",
    avatar: "MJ",
    avatarGradient: "from-sky-400 to-blue-600",
    rating: 5,
    text: "The best investment we made this year. The built-in analytics alone saved us four months of engineering. Our investors were blown away by our velocity.",
  },
  {
    name: "Emily Rodriguez",
    role: "Engineering Lead",
    company: "ScaleUp",
    avatar: "ER",
    avatarGradient: "from-emerald-400 to-teal-600",
    rating: 5,
    text: "Incredible developer experience. The codebase is clean, the docs are thorough, and our team was productive from day one. Nothing else comes close.",
  },
  {
    name: "David Park",
    role: "Product Manager",
    company: "Momentum",
    avatar: "DP",
    avatarGradient: "from-rose-400 to-pink-600",
    rating: 5,
    text: "We evaluated 5 alternatives. This was the only one that didn't feel like a hack. Solid TypeScript, great test coverage, and a team that actually responds.",
  },
  {
    name: "Priya Kapoor",
    role: "Solo Founder",
    company: "IndieHack",
    avatar: "PK",
    avatarGradient: "from-amber-400 to-orange-600",
    rating: 5,
    text: "As a solo founder I can't afford to waste time on boilerplate. This gave me a 6-month head start. Launched in 3 weeks and already profitable.",
  },
  {
    name: "Tom Nakamura",
    role: "Head of Engineering",
    company: "Velocity AI",
    avatar: "TN",
    avatarGradient: "from-cyan-400 to-sky-600",
    rating: 5,
    text: "We migrated our legacy system using this as the new foundation. The migration guide was thorough and our team completed it in a single sprint.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest gradient-text mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by builders worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of developers who ship faster and sleep better.
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid rounded-2xl border border-border/60 bg-background p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <StarRating count={t.rating} />
              <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.avatarGradient} text-white text-xs font-bold`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} at {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
