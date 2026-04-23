# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing Page — Modern marketing landing page with animated hero, feature grid, pricing tables, testimonials, newsletter signup, and responsive nav/footer. Built with Next.js 14 (App Router), React 18, TypeScript 5.9, and Tailwind CSS. Uses `{{BRAND_NAME}}`, `{{TAGLINE}}`, `{{DESCRIPTION}}`, `{{CTA_TEXT}}`, `{{PRIMARY_COLOR}}` template placeholders for customisation.

## Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.2.28 |
| UI runtime | React | 18.3.1 |
| Language | TypeScript (strict) | 5.9.3 |
| Styling | Tailwind CSS | 3.4.19 |
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
```

## Architecture

```
src/
  app/
    layout.tsx          — Root layout: Inter font, OpenGraph metadata, html/body shell
    page.tsx            — Landing page composition: Nav > Hero > LogoBar > Features > Pricing > Testimonials > CTA > Footer
    globals.css         — CSS variables for brand colours (--brand-primary, --brand-secondary, --brand-accent)
                          and Tailwind base reset
  components/
    Nav.tsx             — Fixed top nav with desktop links + mobile hamburger (client component, useState)
    Hero.tsx            — Full-bleed hero: gradient blobs, social proof badge, headline, EmailSignup, product screenshot placeholder
    EmailSignup.tsx     — Controlled email form with idle/loading/success/error states (client component)
    LogoBar.tsx         — Trust-building logo strip with placeholder initials
    Features.tsx        — 6-card feature grid (server component, static data)
    Pricing.tsx         — 3-tier pricing cards with popular badge (server component, static data)
    Testimonials.tsx    — Testimonial cards (server component, static data)
    CTA.tsx             — Bottom conversion section with EmailSignup (server component)
    Footer.tsx          — Multi-column footer with social links (server component)
    ui/
      button.tsx        — CVA-based Button with variant + size props (default/outline/ghost/link/destructive/secondary)
  lib/
    utils.ts            — cn() helper (clsx + tailwind-merge)
  test/
    setup.ts            — Vitest global setup: imports @testing-library/jest-dom/vitest matchers
  __tests__/
    EmailSignup.test.tsx — Unit tests: validation states, aria attributes, loading/success lifecycle
    Nav.test.tsx         — Unit tests: link rendering, mobile menu open/close, aria-expanded
    Features.test.tsx    — Unit tests: all 6 cards rendered, section id, headings
e2e/
  home.spec.ts          — Playwright E2E: page load, hero/features/pricing visible, nav, form flows, mobile menu
public/                 — Static assets (favicons, OG images)
```

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
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (auth / data) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public, safe to expose) |

## Rules

- TypeScript strict mode — no `any` types; all props typed as interfaces
- All components must have proper TypeScript interfaces
- Use Tailwind utility classes — no custom CSS files
- ARIA labels on all interactive elements (`aria-label`, `aria-expanded`, `aria-invalid`, `aria-describedby`)
- Error + loading states on all data-fetching components
- Use `next/image` for all images, `next/link` for navigation
- Mock `next/link` and `next/image` in Vitest tests (they require the Next.js router)
- E2E specs live in `e2e/` — Playwright auto-starts the dev server via `webServer` config
