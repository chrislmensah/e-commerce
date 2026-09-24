# [Brand Name] — E-Commerce Platform

> Replace `[Brand Name]` once the brand name is locked in.

## Overview

A full e-commerce platform for a clothing brand targeting the **Ghana market** — website, companion mobile app, and admin/inventory panel, all sharing a single backend API.

- **Status:** Backend API complete and tested. Payments partially integrated. Storefront/mobile UI not started.
- **Target market:** Ghana (GHS currency, mobile money via Paystack, local delivery flows)

## Tech Stack

| Layer | Choice |
|---|---|
| Web (storefront + admin) | Next.js, TypeScript, Tailwind CSS |
| Mobile | Expo (React Native), TypeScript — not started |
| Backend | Next.js API routes |
| Database | PostgreSQL (Neon, serverless) |
| ORM | Drizzle |
| Auth | better-auth (email/password, role-based) |
| Rate limiting | better-auth built-in (auth routes) + Upstash Redis (custom routes) |
| Payments | Paystack (checkout initialization done; webhook pending) |
| Hosting (web) | Vercel |
| Hosting (DB) | Neon |

## Project Structure
e-commerce/
├── apps/
│ ├── web/ # Next.js — storefront + admin + API
│ │ ├── app/
│ │ │ ├── api/
│ │ │ │ ├── auth/[...all]/ # better-auth catch-all
│ │ │ │ ├── products/ # public product listing
│ │ │ │ ├── cart/ # cart (auth required)
│ │ │ │ ├── orders/ # orders + payment init
│ │ │ │ │ └── [orderId]/pay/
│ │ │ │ └── admin/ # admin-only routes
│ │ │ │ ├── products/
│ │ │ │ ├── inventory/[variantId]/
│ │ │ │ ├── orders/[orderId]/status/
│ │ │ │ └── dashboard/
│ │ │ ├── (storefront)/ # public shopping pages — not built yet
│ │ │ └── admin/ # admin UI pages — not built yet
│ │ └── lib/
│ │ ├── db.ts # Drizzle client instance
│ │ └── rate-limit.ts # Upstash rate limiters
│ └── mobile/ # Expo app — not started
├── packages/
│ ├── db/ # Drizzle schema + client + migration scripts
│ │ └── scripts/make-admin.ts # promote a user to admin role
│ ├── auth/ # better-auth config + requireAuth/requireAdmin helpers
│ └── config/ # shared ESLint/TS config
├── .github/workflows/ci.yml
├── pnpm-workspace.yaml
└── README.md



## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

