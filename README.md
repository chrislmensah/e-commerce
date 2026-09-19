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
| Auth | better-auth (Drizzle adapter) |
| Payments | Paystack or Flutterwave (local cards + mobile money) |
| Hosting (web) | Vercel |
| Hosting (DB) | Neon (serverless Postgres, native Vercel integration) |

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

### Phase 1 — Lock remaining decisions ✅
- [x] ORM: Drizzle
- [x] Auth: better-auth
- [x] Hosting: Vercel (web) + Neon (DB)

### Phase 2 — Scaffold the real monorepo
- [x] `pnpm-workspace.yaml` at the root
- [x] `apps/web` — bare Next.js app with real `lint`/`typecheck`/`build` scripts
- [ ] `apps/mobile` — bare Expo app
- [x] `packages/db` — schema + client using the chosen ORM
- [x] Run `pnpm install`, commit the real `pnpm-lock.yaml`
- [x] Swap the CI workflow from the stub back to the real checks

### Phase 3 — Database schema
- [x] Model users, products, variants, inventory, orders, order_items, admin roles
- [ ] Write migrations with the chosen ORM

### Phase 4 — Backend API ✅
- [x] Product, cart, and order endpoints
- [x] Auth wired in (register, login, session)
- [x] Admin-only routes protected by role

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
│   ├── db/                       # shared schema + DB client (Drizzle)
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
- [ ] Delivery/logistics approach






*******************************************************************************************


Pull Request: Backend API — Auth, Commerce Core, Admin Panel, Rate Limiting, Payments (Paystack)
Summary

Implements the full backend API for the e-commerce platform: authentication with role-based access, customer-facing commerce endpoints (products, cart, orders), an admin panel API surface, database-backed rate limiting, and the first half of Paystack payment integration.

Auth
Integrated better-auth with a Drizzle Postgres adapter, using a single user table with a role column (customer | admin) rather than separate login systems.
role field is marked input: false in better-auth's additionalFields config to prevent privilege escalation via sign-up — no client can set their own role.
Mapped better-auth's core name field to a custom fullName column via fields: { name: "fullName" }.
IDs generated via randomUUID() (advanced.database.generateId) to keep consistent UUID-style identifiers across the schema.
Admin promotion handled out-of-band via a one-off script (packages/db/scripts/make-admin.ts), not exposed through any API route.
requireAuth() / requireAdmin() helpers added in @e-commerce/auth, used to gate every protected route.
Database schema changes
Added better-auth's required tables: session, account, verification, rate_limit.
Converted addresses.user_id, carts.user_id, orders.user_id from uuid → text to match better-auth's user.id type.
Fixed rate_limit.last_request column type from timestamp → bigint (better-auth writes a raw millisecond number here, not a Date — this was a real crash-causing bug, tracked upstream as a known better-auth/Drizzle adapter issue).
Customer-facing API
GET /api/products — search, category filter, pagination; filters out inactive products; joins variant + stock data.
GET /api/cart / POST /api/cart — cart is one-per-user; POST correctly upserts (increments existing line item quantity instead of duplicating rows — this was a bug found and fixed during testing).
POST /api/orders — reads from the user's cart (not a request body), validates address ownership, checks stock per item before writing anything, decrements inventory, snapshots product/variant/price into order_items, and clears the cart — all inside a single DB transaction so a failure (e.g. insufficient stock) rolls back cleanly with zero side effects.
GET /api/orders — order history with nested items, address, and payments.
Admin API (all behind requireAdmin())
POST /api/admin/products — creates a product with one or more variants, and an initial inventory row per variant, in one transaction.
PATCH /api/admin/inventory/[variantId] — updates stock quantity / low-stock threshold.
PATCH /api/admin/orders/[orderId]/status — updates order fulfillment status (validated against the order_status enum via Zod); transitions are currently unrestricted (no state-machine enforcement yet — flagged as a possible future improvement, not a current requirement).
GET /api/admin/dashboard — aggregate totals: order count, total revenue (excludes cancelled orders), orders grouped by status.
Rate limiting
Auth routes (sign-in, sign-up): better-auth's built-in rate limiter, storage: "database" (required for correctness on serverless — in-memory storage doesn't persist across Vercel function invocations). Sign-in: 5/min per IP. Sign-up: 3/hour per IP.
Custom routes (/api/orders, all /api/admin/* writes): Upstash Redis + @upstash/ratelimit, sliding window, keyed per authenticated user ID rather than IP. Orders: 10/min. Admin writes: 30/min.
All rate-limit checks are placed as the first operation after the auth check, before any DB reads/business logic, so throttled requests are rejected cheaply.
Payments (Paystack) — partial
POST /api/orders/[orderId]/pay — validates order ownership and pending status, initializes a Paystack transaction (amount converted to pesewas), returns a hosted authorizationUrl. Confirmed working end-to-end against Paystack's test environment.
Not yet implemented: the payment webhook (/api/webhooks/paystack) that marks an order "paid" on confirmed payment, with signature verification. Until this exists, orders can be initiated for payment but status never updates automatically.
Known issues / follow-ups (not blocking this PR, tracked separately)
Production deployment (Vercel) has an intermittent/unresolved 500 on sign-in — root cause not fully captured in logs yet; deprioritized in favor of payment work.
Occasional ConnectTimeoutError reaching api.paystack.co and intermittent Failed to get session errors observed locally — appears environment/network-related (possibly Neon cold-start latency), not a code defect; needs further observation before deciding if retry/backoff logic is warranted.
No OpenAPI/Swagger documentation yet — planned once the API surface is frozen post-payments.
Testing performed

Manually verified via Postman against local dev + Neon:

Sign-up (incl. duplicate-email rejection), sign-in, session-gated routes, admin role enforcement (403 for non-admins)
Cart upsert accumulation (fixed regression)
Order creation: happy path (stock decrement, cart clear), insufficient-stock rejection with confirmed rollback (inventory and cart unchanged)
Admin product creation, inventory update, order status update, dashboard aggregates
Rate limit thresholds on sign-in, orders, and admin writes (429 confirmed at the expected request count)
Paystack checkout session initialization returns a valid, working authorizationUrl
