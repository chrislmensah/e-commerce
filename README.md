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

Two separate `.env` files are needed — see [Environment Variables](#environment-variables) below for why.

**`packages/db/.env`**

DATABASE_URL=postgresql://...

**`apps/web/.env.local`**

DATABASE_URL=postgresql://... # same value as above
BETTER_AUTH_SECRET=... # generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
BETTER_AUTH_URL=http://localhost:3000
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
PAYSTACK_SECRET_KEY=sk_test_...


### 3. Push the database schema

```bash
cd packages/db
pnpm drizzle-kit push
```

### 4. Run the dev server

```bash
cd apps/web
pnpm dev
```

Server runs at `http://localhost:3000`.

### 5. Create an admin user

Sign up a normal user via the API first (see [API Reference](#api-reference)), then promote them:

```bash
cd packages/db
node --env-file=.env --import tsx scripts/make-admin.ts your-email@example.com
```

## Environment Variables

`packages/db/.env` and `apps/web/.env.local` are **separate files read by separate processes** — `drizzle-kit` (run from `packages/db`) only reads the former; the running Next.js app (`apps/web`) only reads the latter. Both need `DATABASE_URL` independently.

## API Reference

All routes are under `/api`. Full endpoint list, request/response shapes, and auth requirements: see [`api-endpoints.md`](./api-endpoints.md) *(update this file alongside the summary below — or replace both with generated OpenAPI docs once that's in place)*.

### Auth (`/api/auth/[...all]` — handled by better-auth)
- `POST /api/auth/sign-up/email` — register (`email`, `password`, `name`)
- `POST /api/auth/sign-in/email` — log in
- `GET /api/auth/get-session` — check current session

Rate limited: 5 sign-in attempts/min, 3 sign-ups/hour, per IP.

### Customer
| Method | Route | Auth |
|---|---|---|
| GET | `/api/products` | Public |
| GET | `/api/cart` | Required |
| POST | `/api/cart` | Required |
| POST | `/api/orders` | Required — reads from cart, needs `addressId` |
| GET | `/api/orders` | Required |
| POST | `/api/orders/[orderId]/pay` | Required — initializes Paystack checkout |

Orders are rate limited to 10/min per user.

### Admin
| Method | Route | Auth |
|---|---|---|
| POST | `/api/admin/products` | Admin |
| PATCH | `/api/admin/inventory/[variantId]` | Admin |
| PATCH | `/api/admin/orders/[orderId]/status` | Admin |
| GET | `/api/admin/dashboard` | Admin |

Admin writes rate limited to 30/min per admin.

## Known Limitations / In Progress

- **Payment webhook not implemented.** `/api/orders/[orderId]/pay` returns a working Paystack checkout URL, but nothing currently marks an order `"paid"` after the customer completes payment — that requires a webhook handler with signature verification (planned next).
- **Production deployment has an unresolved intermittent 500 on sign-in** — under investigation.
- **No storefront or mobile UI yet** — backend/API only.
- **No OpenAPI/Swagger docs yet** — planned once the API surface is frozen (post-payments).
- Order status transitions are currently unrestricted (no enforced state machine — e.g. `delivered` → `pending` is technically allowed).

## CI/CD

`.github/workflows/ci.yml` lints, type-checks, and builds on every PR into `main`. Branch protection requires this to pass before merge.

## Team

| Name | Role |
|---|---|
| [Name 1] | |
| [Name 2] | |

## Open Decisions

- [ ] Hosting for mobile app builds (EAS?)
- [ ] Delivery/logistics approach




