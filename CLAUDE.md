# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing Page — Production-quality marketing landing page with animated hero, feature grid, pricing tables, DB-driven testimonials and FAQs, waitlist signup (Supabase), and responsive nav/footer. Built with Next.js 14 (App Router), React 18, TypeScript 5.9, Tailwind CSS, and Supabase (PostgreSQL).

## Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.2.28 |
| UI runtime | React | 18.3.1 |
| Language | TypeScript (strict) | 5.9.3 |
| Styling | Tailwind CSS | 3.4.19 |
| Database | Supabase (PostgreSQL) | 2.49.1 |
| Icon set | lucide-react | 0.577.0 |
| Primitives | @radix-ui/react-slot | 1.2.4 |
| Unit tests | Vitest + jsdom | 2.1.8 |
| Component tests | @testing-library/react | 16.1.0 |
| E2E tests | Playwright | 1.49.1 |

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint
npm run typecheck        # TypeScript type check (tsc --noEmit)

# Unit / component tests
npm test                 # Run all Vitest unit tests (one-shot)
npm run test:watch       # Vitest in watch mode
npm run test:coverage    # Vitest with v8 coverage report

# E2E tests (requires dev server or builds the app automatically)
npm run test:e2e         # Playwright — all specs in e2e/
npm run test:e2e:ui      # Playwright interactive UI mode

# Database
npx supabase start       # Start local Supabase
npx supabase db reset    # Reset DB and run migrations + seed
```

## Architecture

```
src/
  app/
    layout.tsx          -- Root layout: Inter font, OpenGraph metadata, html/body shell
    page.tsx            -- Async Server Component: fetches testimonials + FAQs from DB, composes page
    globals.css         -- CSS variables for brand colours + Tailwind base reset
    api/
      waitlist/
        route.ts        -- POST /api/waitlist: validates email, inserts into Supabase waitlist table
  components/
    Nav.tsx             -- Fixed top nav with desktop links + mobile hamburger (client component)
    Hero.tsx            -- Full-bleed hero: gradient blobs, social proof badge, headline, EmailSignup
    EmailSignup.tsx     -- Waitlist signup form: POSTs to /api/waitlist with validation + toast feedback (client component)
    LogoBar.tsx         -- Trust-building logo strip with placeholder initials
    Features.tsx        -- 6-card feature grid (server component, static data)
    Pricing.tsx         -- 3-tier pricing cards with popular badge (server component, static data)
    Testimonials.tsx    -- DB-driven testimonial cards with avatar fallbacks (server component, props from page)
    FAQ.tsx             -- DB-driven accordion FAQ section (client component for expand/collapse)
    CTA.tsx             -- Bottom conversion section with EmailSignup
    Footer.tsx          -- Multi-column footer with social links
    ui/
      button.tsx        -- CVA-based Button primitive
  lib/
    supabase.ts         -- Supabase client singleton (client-side)
    queries.ts          -- Server-side data fetching: getTestimonials(), getFAQs() with fallbacks
    utils.ts            -- cn() helper (clsx + tailwind-merge)
  types/
    database.ts         -- Supabase database types: Testimonial, FAQ, WaitlistEntry
  test/
    setup.ts            -- Vitest global setup
  __tests__/
    EmailSignup.test.tsx -- Unit tests: validation, aria, loading/success, API integration
    Nav.test.tsx         -- Unit tests: links, mobile menu, aria-expanded
    Features.test.tsx    -- Unit tests: feature cards
    FAQ.test.tsx         -- Unit tests: FAQ accordion expand/collapse
    Testimonials.test.tsx -- Unit tests: testimonial rendering with DB data shape
    waitlist-route.test.ts -- Unit tests: API route validation, insert, duplicate handling
e2e/
  home.spec.ts          -- Playwright E2E: full page flows including FAQ section
supabase/
  migrations/
    20240101000000_initial_schema.sql -- Tables: waitlist, testimonials, faqs with RLS
  seed.sql              -- 6 testimonials, 8 FAQs, 3 sample waitlist entries
public/                 -- Static assets (favicons, OG images)
```

## Database Schema

Three tables with RLS policies:

- **waitlist** (id uuid PK, email UNIQUE, name, referral_source, created_at) -- INSERT by anyone, SELECT by authenticated
- **testimonials** (id uuid PK, author_name, author_role, author_company, author_avatar_url, content, rating 1-5, featured, sort_order, created_at) -- SELECT by anyone
- **faqs** (id uuid PK, question, answer, category, sort_order, created_at) -- SELECT by anyone

Graceful fallback: when Supabase is not configured, hardcoded data is used so the template works out-of-the-box.

## Brand Customisation

Replace all `{{PLACEHOLDER}}` comments in source files and update the CSS custom properties in `src/app/globals.css`:

```css
:root {
  --brand-primary:   /* your primary hex/oklch */;
  --brand-secondary: /* your secondary */;
  --brand-accent:    /* your accent */;
}
```

Components reference these variables inline (`var(--brand-primary)`) so a single CSS change re-themes the entire page.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public, safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional server-side key for waitlist API route |

## Rules

- TypeScript strict mode -- no `any` types; all props typed as interfaces
- All components must have proper TypeScript interfaces
- Use Tailwind utility classes -- no custom CSS files
- ARIA labels on all interactive elements (`aria-label`, `aria-expanded`, `aria-invalid`, `aria-describedby`)
- Error + loading states on all data-fetching components
- Use `next/image` for all images, `next/link` for navigation
- Mock `next/link` and `next/image` in Vitest tests (they require the Next.js router)
- E2E specs live in `e2e/` -- Playwright auto-starts the dev server via `webServer` config
- Database types in `src/types/database.ts` must stay in sync with `supabase/migrations/`
- API routes validate input server-side; never trust client data
- Supabase queries use the typed client from `src/lib/supabase.ts`
- All DB-driven components accept data via props (fetched in page.tsx Server Component)
- Fallback data in `src/lib/queries.ts` ensures the app works without a database connection
