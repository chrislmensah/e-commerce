# e-commerce

Minimal shared backend domain for a clothing store's web app, mobile app, and admin panel.

## What is implemented
- Shared catalog and stock state for both `web` and `mobile` channels
- Product variant stock tracking per `(size, color)`
- Cart + checkout flow with local payment options:
  - Gateways: `paystack`, `flutterwave`
  - Methods: `card`, `mobile_money`
- Oversell protection at cart and checkout time
- Admin order fulfillment transitions (`paid -> processing -> shipped -> delivered`, with controlled cancellation)

## Run tests
```bash
python -m unittest discover -s tests
```
