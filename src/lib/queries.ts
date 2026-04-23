import { createClient } from "@supabase/supabase-js";
import type { Database, Testimonial, FAQ } from "@/types/database";

/**
 * Server-side data fetching for landing page content.
 * These run at build time (SSG) or request time (SSR) in Server Components.
 * Falls back to hardcoded data when Supabase is not configured,
 * so the template works out-of-the-box without a database.
 */

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url === "https://your-project.supabase.co") {
    return null;
  }
  return createClient<Database>(url, key);
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    author_name: "Sarah Chen",
    author_role: "CTO",
    author_company: "TechCorp",
    author_avatar_url: null,
    content:
      "This platform cut our development time in half. We went from idea to production in two weeks — something that would have taken months before.",
    rating: 5,
    featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    author_name: "Marcus Johnson",
    author_role: "Founder",
    author_company: "StartupXYZ",
    author_avatar_url: null,
    content:
      "The best investment we made this year. The built-in analytics alone saved us four months of engineering. Our investors were blown away by our velocity.",
    rating: 5,
    featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    author_name: "Emily Rodriguez",
    author_role: "Engineering Lead",
    author_company: "ScaleUp",
    author_avatar_url: null,
    content:
      "Incredible developer experience. The codebase is clean, the docs are thorough, and our team was productive from day one. Nothing else comes close.",
    rating: 5,
    featured: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    author_name: "David Park",
    author_role: "Product Manager",
    author_company: "Momentum",
    author_avatar_url: null,
    content:
      "We evaluated 5 alternatives. This was the only one that didn't feel like a hack. Solid TypeScript, great test coverage, and a team that actually responds.",
    rating: 5,
    featured: false,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    author_name: "Priya Kapoor",
    author_role: "Solo Founder",
    author_company: "IndieHack",
    author_avatar_url: null,
    content:
      "As a solo founder I can't afford to waste time on boilerplate. This gave me a 6-month head start. Launched in 3 weeks and already profitable.",
    rating: 5,
    featured: false,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    author_name: "Tom Nakamura",
    author_role: "Head of Engineering",
    author_company: "Velocity AI",
    author_avatar_url: null,
    content:
      "We migrated our legacy system using this as the new foundation. The migration guide was thorough and our team completed it in a single sprint.",
    rating: 5,
    featured: false,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
];

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabase();
  if (!supabase) return FALLBACK_TESTIMONIALS;

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    console.warn("Failed to fetch testimonials from DB, using fallback:", error?.message);
    return FALLBACK_TESTIMONIALS;
  }

  return data;
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

const FALLBACK_FAQS: FAQ[] = [
  {
    id: "1",
    question: "What is included in the free trial?",
    answer:
      "Every plan includes a full-featured 14-day free trial. No credit card required. You get access to all features of the plan you choose, including analytics, API access, and team collaboration.",
    category: "billing",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    question: "Can I change plans later?",
    answer:
      "Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. Downgrades take effect at the next billing date.",
    category: "billing",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    question: "Is my data secure?",
    answer:
      "Security is our top priority. We are SOC 2 Type II certified, use end-to-end encryption for data in transit and at rest, and support SSO/SAML for enterprise customers. All data is hosted on ISO 27001-certified infrastructure.",
    category: "security",
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    question: "Do you offer a self-hosted option?",
    answer:
      "Yes — our Enterprise plan includes the option for on-premise deployment. Contact our sales team for details on infrastructure requirements and pricing.",
    category: "product",
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    question: "What kind of support do you offer?",
    answer:
      "All plans include community support via our forum. Pro plans get priority email support with a 4-hour SLA. Enterprise customers receive a dedicated account manager and custom SLA terms.",
    category: "support",
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    question: "Can I use my own domain?",
    answer:
      "Yes. Custom domains are available on all plans. Starter plans support one custom domain, while Pro and Enterprise plans support unlimited custom domains with automatic SSL provisioning.",
    category: "product",
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    question: "How does billing work?",
    answer:
      "We bill monthly or annually (with a 20% discount for annual plans). All prices are in USD. We accept all major credit cards and can arrange invoicing for Enterprise customers.",
    category: "billing",
    sort_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    question: "What happens when I cancel?",
    answer:
      "You can cancel anytime with no penalties. Your account will remain active until the end of your current billing period. After that, your data is retained for 30 days in case you change your mind.",
    category: "billing",
    sort_order: 8,
    created_at: new Date().toISOString(),
  },
];

export async function getFAQs(): Promise<FAQ[]> {
  const supabase = getSupabase();
  if (!supabase) return FALLBACK_FAQS;

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    console.warn("Failed to fetch FAQs from DB, using fallback:", error?.message);
    return FALLBACK_FAQS;
  }

  return data;
}
