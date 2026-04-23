import { Star } from "lucide-react";
import type { Testimonial } from "@/types/database";

/** Map author initials to a gradient for the avatar fallback */
const AVATAR_GRADIENTS = [
  "from-violet-400 to-purple-600",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-600",
  "from-cyan-400 to-sky-600",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
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
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className="break-inside-avoid rounded-2xl border border-border/60 bg-background p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <StarRating count={t.rating} />
              <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                {t.author_avatar_url ? (
                  <img
                    src={t.author_avatar_url}
                    alt={t.author_name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} text-white text-xs font-bold`}
                  >
                    {getInitials(t.author_name)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm">{t.author_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.author_role}
                    {t.author_company ? ` at ${t.author_company}` : ""}
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
