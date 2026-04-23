# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing Page — Modern marketing landing page with animated hero, feature grid, pricing tables, testimonials, newsletter signup, and responsive nav/footer. Built with Next.js 14, Tailwind CSS, and lucide-react. Uses {{BRAND_NAME}}, {{TAGLINE}}, {{DESCRIPTION}}, {{CTA_TEXT}}, {{PRIMARY_COLOR}} placeholders.

Built with Next.js 14, React 19, TypeScript 5.9, and Tailwind CSS.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npx tsc --noEmit         # Type check
npm run lint             # ESLint
```

## Architecture

- `src/app/` — App Router pages and layouts
- `src/components/` — Reusable React components
- `src/lib/` — Utilities, helpers, API clients
- `public/` — Static assets

## Rules

- TypeScript strict mode — no `any` types
- All components must have proper TypeScript interfaces
- Use Tailwind utility classes — no custom CSS files
- ARIA labels on all interactive elements
- Error + loading states on all data-fetching components
- Use `next/image` for all images, `next/link` for navigation
