# API Endpoints Reference

Base URL (local): `http://localhost:3000`
Base URL (production): `https://e-commerce-web-psi-sage.vercel.app`

All request/response bodies are JSON. Authenticated routes rely on a session cookie set by better-auth after sign-in — no manual token handling required when testing via a browser or a client that persists cookies (Postman's cookie jar handles this automatically within a workspace).

---

## Authentication

Handled by better-auth via a catch-all route (`/api/auth/[...all]`). Only the endpoints actually used by this project are documented below — better-auth exposes additional routes not currently used by the frontend.

### Sign up

```
POST /api/auth/sign-up/email
```

**Body**
```json
{
  "email": "customer@example.com",
  "password": "password123",
  "name": "Jane Doe"
}
```

**Response — 200**
```json
{
  "user": { "id": "...", "email": "customer@example.com", "fullName": "Jane Doe", "role": "customer", "..." : "..." },
  "session": { "token": "...", "expiresAt": "..." }
}
```

**Errors**
- `422 USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL` — email already registered
- `400 VALIDATION_ERROR` — missing/invalid field
- `429` — rate limited (3 sign-ups/hour per IP)

All new users default to `role: "customer"`. Role cannot be set via this endpoint — better-auth ignores any `role` field sent in the body.

### Sign in

```
POST /api/auth/sign-in/email
```

**Body**
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Response — 200:** user + session, sets session cookie.

**Errors**
- `401` — invalid credentials
- `429` — rate limited (5 attempts/min per IP)

### Get current session

```
GET /api/auth/get-session
```

Requires the session cookie from sign-in. Returns the current user/session, or `null` if not signed in.

---

## Products (public)

### List products

```
GET /api/products
```

**Query parameters** (all optional)
| Param | Type | Description |
|---|---|---|
| `search` | string | Case-insensitive match against product name |
| `category` | string | Category slug |
| `page` | number | Page number, default `1` (20 per page) |

**Response — 200**
```json
{
  "products": [
    {
      "product": { "id": "...", "name": "Classic Crew Neck Tee", "basePrice": "120.00", "isActive": true, "..." : "..." },
      "category": { "id": "...", "name": "T-Shirts", "slug": "t-shirts" },
      "variant": { "id": "...", "size": "M", "color": "Black", "priceOverride": null, "..." : "..." },
      "stock": 48
    }
  ],
  "page": 1,
  "limit": 20
}
```

Only active products (`isActive: true`) are returned. No auth required.

---

## Cart (auth required)

### Get current user's cart

```
GET /api/cart
```

**Response — 200**
```json
{
  "id": "...",
  "userId": "...",
  "createdAt": "...",
  "items": [
    {
      "id": "...",
      "cartId": "...",
      "variantId": "...",
      "quantity": 2,
      "variant": {
        "id": "...",
        "size": "M",
        "color": "Black",
        "product": { "name": "Classic Crew Neck Tee", "basePrice": "120.00" }
      }
    }
  ]
}
```

Returns `{ "items": [] }` if the user has no cart yet.

### Add / update item in cart

```
POST /api/cart
```

**Body**
```json
{
  "variantId": "0ac1027e-5427-4d16-aae4-227e0d2cbe7d",
  "quantity": 2
}
```

**Response — 200**
```json
{ "message": "Item added to cart" }
```

Behavior: creates a cart if the user doesn't have one yet. If the variant is already in the cart, **adds** to the existing quantity (upsert) rather than creating a duplicate row.

**Errors**
- `401` — not signed in

---

## Orders (auth required)

Orders are created **from the current cart**, not from an items array in the request body.

### Create order (checkout)

```
POST /api/orders
```

**Body**
```json
{
  "addressId": "ba781183-4218-4fdf-bde8-02b3421aa048"
}
```

**Response — 200**
```json
{ "orderId": "221e9bb8-a61c-4206-a088-edc6cdc8b23f" }
```

Behavior (all inside a single DB transaction):
1. Validates the address belongs to the requesting user
2. Checks stock for every cart item **before** writing anything
3. Computes total from `priceOverride` (if set) or `basePrice`
4. Creates the order (`status: "pending"`) and snapshots each item into `order_items` (product name, size, color, unit price — frozen at time of purchase)
5. Decrements `inventory` per variant
6. Clears the cart

If any item has insufficient stock, the entire transaction rolls back — no partial writes, no inventory change, cart untouched.

**Errors**
- `400 { "error": "Missing addressId" }`
- `400 { "error": "Invalid or missing JSON body" }`
- `400 { "error": "Cart is empty" }`
- `400 { "error": "Insufficient stock for <Product Name> (<Size>/<Color>)" }`
- `429` — rate limited (10 orders/min per user)

### Order history

```
GET /api/orders
```

**Response — 200**
```json
{
  "orders": [
    {
      "id": "...",
      "status": "pending",
      "totalAmount": "240.00",
      "items": [ { "productName": "...", "size": "M", "color": "Black", "unitPrice": "120.00", "quantity": 2 } ],
      "address": { "region": "Greater Accra", "city": "Accra", "..." : "..." },
      "payments": []
    }
  ]
}
```

### Initialize payment for an order

```
POST /api/orders/{orderId}/pay
```

No request body needed.

**Response — 200**
```json
{
  "authorizationUrl": "https://checkout.paystack.com/ypwcbxtl3l1upeh",
  "reference": "order_221e9bb8-a61c-4206-a088-edc6cdc8b23f_1789662414825"
}
```

Redirect the customer to `authorizationUrl` to complete payment on Paystack's hosted checkout page. Amount is converted to the smallest currency unit (pesewas) automatically; currency is fixed to `GHS`.

**Errors**
- `404` — order not found, or doesn't belong to the requesting user
- `400 { "error": "Order is already {status}, cannot initiate payment" }` — order isn't `pending`
- `503` — could not reach Paystack (network/timeout)

> ⚠️ **Payment confirmation is not yet automatic.** Completing payment on Paystack's checkout page does not currently update the order's status — the webhook handler that listens for Paystack's payment confirmation and sets `status: "paid"` has not been built yet. Order status must currently be updated manually via the admin status endpoint below.

---

## Admin (admin role required)

All routes below require the signed-in user to have `role: "admin"`. Non-admins receive `403 Forbidden`. All are rate limited to 30 requests/min per admin.

### Create product

```
POST /api/admin/products
```

**Body**
```json
{
  "categoryId": "optional-category-uuid",
  "name": "Classic Crew Neck Tee",
  "description": "100% cotton, unisex fit",
  "basePrice": 120.00,
  "variants": [
    { "size": "M", "color": "Black", "initialStock": 20 },
    { "size": "L", "color": "Black", "initialStock": 15 }
  ]
}
```

`variants[].priceOverride` and `variants[].imageUrl` are optional per variant.

**Response — 201**
```json
{ "product": { "id": "...", "name": "Classic Crew Neck Tee", "basePrice": "120.00", "..." : "..." } }
```

Creates the product, all variants, and an `inventory` row per variant, in one transaction.

**Errors**
- `400` — validation failure (Zod), or referenced `categoryId` doesn't exist

### Update inventory

```
PATCH /api/admin/inventory/{variantId}
```

**Body**
```json
{
  "quantity": 50,
  "lowStockThreshold": 10
}
```
`lowStockThreshold` is optional.

**Response — 200**
```json
{ "inventory": { "variantId": "...", "quantity": 50, "lowStockThreshold": 10 } }
```

**Errors**
- `404` — variant or its inventory record not found
- `400` — validation failure

### Update order status

```
PATCH /api/admin/orders/{orderId}/status
```

**Body**
```json
{ "status": "shipped" }
```

Valid values: `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`.

**Response — 200**
```json
{ "order": { "id": "...", "status": "shipped", "updatedAt": "...", "..." : "..." } }
```

**Errors**
- `404` — order not found
- `400` — invalid status value

> Note: transitions are currently unrestricted — an order can move to any status from any other status. No workflow/state-machine enforcement yet.

### Sales dashboard

```
GET /api/admin/dashboard
```

**Response — 200**
```json
{
  "totalOrders": 47,
  "totalRevenue": "12450.00",
  "ordersByStatus": {
    "pending": 5,
    "shipped": 12,
    "delivered": 30
  }
}
```

`totalRevenue` excludes cancelled orders. `ordersByStatus` only includes statuses that currently have at least one order — a status with zero orders won't appear as a key.

---

## Rate Limiting Summary

| Scope | Limit | Storage |
|---|---|---|
| Sign-in | 5 / 60s per IP | Database (better-auth) |
| Sign-up | 3 / hour per IP | Database (better-auth) |
| Orders (create) | 10 / min per user | Upstash Redis |
| Admin writes (all) | 30 / min per admin | Upstash Redis |

Rate-limited requests return `429` with an error message. All checks run before any DB work in the handler.

---

## Error Shape Conventions

- `400` — malformed request or business-rule validation failure (e.g. insufficient stock, duplicate email)
- `401` — no valid session
- `403` — valid session, insufficient role
- `404` — resource not found, or not owned by the requesting user
- `429` — rate limit exceeded
- `500` — unhandled server error (should be rare; report if encountered)
- `503` — upstream dependency (e.g. Paystack) unreachable

Most handlers return errors as `{ "error": "..." }` or, for Zod validation failures, `{ "error": <zod flatten() output> }`.