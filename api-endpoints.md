# API Endpoints Documentation

This document lists the available API endpoints for the e-commerce application.

## Products
- `GET /api/products`: Fetches all products with variants and categories.

## Cart
- `GET /api/cart`: Fetches the authenticated user's cart.
- `POST /api/cart`: Adds an item to the authenticated user's cart.
    - Body: `{ "variantId": string, "quantity": number }`

## Orders
- `POST /api/orders`: Places an order based on the user's current cart and clears it.
    - Body: `{ "addressId": string }`
    - Requirements: User must have an active cart.

## Authentication
- `[POST, GET] /api/auth/[...all]`: Authentication endpoints handled by `better-auth`. Please refer to `better-auth` documentation for specific sub-endpoints.
