# e-commerce
# [Brand Name] — E-Commerce Platform

> Replace `[Brand Name]` above (and anywhere else it appears) once the brand name is locked in.

## Overview

A full e-commerce website and companion mobile app for a clothing brand, including a built-in admin/inventory panel. Website and app share a single backend API.

- **Status:** Planning / early development
- **Target market:** Ghana (payments, currency, and delivery flows built around this)

## What We're Building

An online store for a clothing brand, built as a website with a matching mobile app, plus an admin panel behind the scenes for running the business.

On the customer side, people can browse the catalog, view products with size/color options, add items to a cart, and check out using local payment methods (cards and mobile money via Paystack or Flutterwave) — all from either the website or the app, since both talk to the same backend.

On the business side, the admin panel is where the brand actually gets managed day to day: adding and editing products, tracking stock per size/color so nothing gets oversold, and moving orders through fulfillment once they come in.

The two apps (web and mobile) are built as separate frontends sharing one API and one database, so a product or stock update made in the admin panel shows up everywhere instantly — there's no syncing two separate systems.

## Tech Stack

| Layer | Choice |
|---|---|
| Web (storefront + admin) | Next.js, TypeScript, Tailwind CSS |
| Mobile | Expo (React Native), TypeScript |
| Backend | Next.js API routes |
| Database | PostgreSQL |
| ORM | Drizzle |
| Auth | TBD — e.g. better-auth / NextAuth |
| Payments | Paystack or Flutterwave (local cards + mobile money) |
| Hosting (web) | TBD — e.g. Vercel |
| Hosting (DB) | TBD — e.g. Railway / Supabase |

## Core Features

### Customer-Facing (Website + App)
- Browse products by category
- Product detail pages with variants (size, color)
- Search and filter
- Shopping cart
- Checkout with payment (Paystack/Flutterwave, mobile money support)
- User accounts (register, login, profile)
- Order history and order tracking

### Admin / Inventory Panel (Web only)
- Product management (create, edit, delete, images, pricing)
- Inventory tracking per variant, with low-stock alerts
- Order management and fulfillment status updates
- Basic sales/analytics dashboard
- Admin roles and permissions

### Mobile App (Expo)
- Same core shopping features as the website
- Push notifications for order updates (phase 2)

## Build Roadmap

### Now — Close out CI/CD
- [ ] Patch the workflow (drop `cache: 'pnpm'`, stub install/lint/build) so the check runs green
- [ ] Add a target to the ruleset (Include default branch, or by pattern → `main`) so the rules actually apply

### Phase 1 — Lock remaining decisions
- [x] ORM: Drizzle
- [ ] Auth: better-auth, NextAuth, or similar
- [ ] Hosting: web (e.g. Vercel) + DB (e.g. Railway/Supabase)

### Phase 2 — Scaffold the real monorepo
- [x] `pnpm-workspace.yaml` at the root
- [x] `apps/web` — bare Next.js app with real `lint`/`typecheck`/`build` scripts
- [x] `apps/mobile` — bare Expo app
- [x] `packages/db` — schema + client using the chosen ORM
- [x] Run `pnpm install`, commit the real `pnpm-lock.yaml`
- [x] Swap the CI workflow from the stub back to the real checks

### Phase 3 — Database schema
- [x] Model users, products, variants, inventory, orders, order_items, admin roles
- [x] Write migrations with the chosen ORM

### Phase 4 — Backend API
- [x] Product, cart, and order endpoints
- [x] Auth wired in (register, login, session)
- [ ] Admin-only routes protected by role

### Phase 5 — Storefront
- [ ] Product listing + detail pages with variant selection
- [ ] Cart and checkout flow
- [ ] Order history / account pages

### Phase 6 — Payments
- [ ] Integrate Paystack or Flutterwave
- [ ] Successful charge decrements inventory

### Phase 7 — Admin/inventory panel
- [ ] Product CRUD (create, edit, delete, images, pricing)
- [ ] Stock management with low-stock alerts
- [ ] Order management and fulfillment status
- [ ] Basic sales dashboard

### Phase 8 — Mobile app
- [ ] Browse, cart, checkout, account screens on the same API
- [ ] Push notifications for order updates (later enhancement)

## Project Structure

```
brand-name/
├── apps/
│   ├── web/                      # Next.js — storefront + admin
│   │   ├── app/
│   │   │   ├── (storefront)/     # public shopping pages
│   │   │   ├── admin/            # admin/inventory panel
│   │   │   └── api/              # backend API routes
│   │   ├── components/
│   │   ├── lib/
│   │   └── public/
│   └── mobile/                   # Expo app
│       ├── app/
│       ├── components/
│       └── lib/
├── packages/
│   ├── db/                       # shared schema + DB client (Prisma/Drizzle)
│   ├── types/                    # shared TypeScript types
│   └── config/                   # shared ESLint/TS config
├── .github/
│   └── workflows/
│       └── ci.yml                # lint, typecheck, build — required to pass before merge
├── .env.example
├── package.json
├── pnpm-workspace.yaml           # or turbo.json if using Turborepo
└── README.md
```

## Team

| Name | Role |
|---|---|
| [Name 1] | |
| [Name 2] | |

## CI/CD

Every pull request into `main` runs a GitHub Actions check (`.github/workflows/ci.yml`) that lints, type-checks, and builds both apps. Branch protection on `main` requires this check to pass before a PR can be merged — no exceptions, no direct pushes to `main`.

- Workflow file: `.github/workflows/ci.yml`
- Enforced via: Settings → Branches → branch protection rule on `main`
- Required checks: lint, typecheck, build (web), build (mobile)

## Open Decisions

- [ ] Brand/project name
- [x] ORM: Drizzle (Selected)
- [ ] Auth solution
- [ ] Hosting provider(s)
- [ ] Delivery/logistics approach