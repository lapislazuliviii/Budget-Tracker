# Student Budget App

## Overview

A web-based budgeting application designed for students. Desktop-first UI targeting users who need to track income, expenses, and savings on a student budget.

**This is a school project.** The code will be presented and defended in an oral defense before a panel of judges. Because of this:

- Code must be **clear and simple** — favor readability over cleverness.
- **Comments are encouraged** — explain what functions do, why decisions were made, and how key logic works. The goal is for a judge reading the code to quickly understand intent.
- Avoid overly abstract patterns or deep nesting. If a simpler approach exists, use it.
- Every architectural or library choice should be justifiable in a Q&A setting.

## Tech Stack

- **Framework:** Vue.js 3 (Composition API, `<script setup>` syntax)
- **Build & Bundler:** Vite (dev server, HMR, and production packaging)
- **CSS:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL, Auth, Row Level Security)
- **Language:** TypeScript
- **Package Manager:** npm

## Project Structure

```
src/
  assets/          # Static assets (images, fonts)
  components/      # Reusable Vue components
  composables/     # Vue composables (shared logic)
  layouts/         # Page layout wrappers
  pages/           # Route-level page components
  router/          # Vue Router config
  stores/          # Pinia state management
  lib/             # Supabase client, utilities
  types/           # TypeScript type definitions
```

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm run lint` — Lint with ESLint
- `npm run type-check` — Run TypeScript type checking

## Conventions

- Use Composition API with `<script setup lang="ts">` in all components.
- Use Pinia for state management.
- Use Vue Router for navigation.
- Tailwind utility classes for styling — no separate CSS files per component unless necessary.
- Supabase client initialized once in `src/lib/supabase.ts` and imported where needed.
- All database tables use Row Level Security (RLS) policies.
- Currency values stored as integers (cents) in the database to avoid floating-point issues; formatted for display in the UI.
- Components are PascalCase filenames (`TransactionList.vue`). Composables are camelCase with `use` prefix (`useTransactions.ts`).

## Supabase

- Environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
- Never expose the service role key in client code.
- Use Supabase Auth for user management — email/password at minimum.
- All queries scoped to the authenticated user via RLS.

## Design Principles

- Desktop-first responsive design — minimum supported width is 1024px.
- Clean, minimal UI appropriate for students (not corporate).
- Accessible: proper labels, keyboard navigation, sufficient contrast.
- Fast: lazy-load routes, minimize bundle size.
