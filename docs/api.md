# API reference

> Quick-and-dirty. Not complete.

All protected endpoints require a JWT token in the `Authorization` header:

## Getting a Token
## POST /api/auth/token
Body: `{ "merchantId": "" }`
Response: `{ "token": "ey..." }`

## `GET /api/health`
No auth. Returns `{ ok: true }`.

## `GET /api/orders`
List orders for the authenticated merchant. Optional query: `from`, `to`, `limit`.

## `GET /api/orders/:id`
Get a single order by ID.

## `POST /api/orders`
Body: `{
  "customer_email": "string",
  "total_amount": "number",
  "type": "sale"
}`.

## `GET /api/revenue?from=...&to=...`
Total revenue for the merchant in the date range.

## `GET /api/metrics/summary`
TODO: document fields.

## `GET /api/metrics/top-customers`
TODO: document fields.

### Errors:
- **400 Bad Request**: Invalid query parameters.
- **401 Unauthorized**: Missing or invalid JWT token.
- **500 Internal Server Error**: Unexpected server error.
