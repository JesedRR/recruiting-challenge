# Decision Log — <Jesed Robles>

> One page max. Specifics over generalities. See `SUBMISSION.md` for the prompt.

## Issues addressed

> Defects, security smells, architectural problems, missing pieces, scaling risks — anything you decided was worth your time. Be specific about *what* was wrong/weak and *why* your shape was the right one.

- **Issue 1 — Insecure Authentication (X-Merchant-Id Header)**
  - What was wrong or weak: The previous implementation trusted a plain `X-Merchant-Id` header sent by clients. This is a major security vulnerability because any client could impersonate any merchant by simply changing the header value. There's no verification that the client actually owns that merchant ID.
  - Shape of my improvement: Implemented JWT-based authentication. Clients now request a token from `/api/auth/token` endpoint, which returns a cryptographically signed JWT. The middleware validates the token signature and expiry on every request. Only a valid token can access protected endpoints.

- **Issue 2 — Unhandled Errors in Routes**
  - What was wrong or weak: The application did not properly handle errors in route handlers. Throwing errors directly caused the server to crash, resulting in `ECONNRESET` errors for clients. This made the application unreliable and difficult to debug.
  - Shape of my improvement: Implemented centralized error-handling middleware to catch and handle all errors consistently. Updated route handlers to use `next(error)` instead of throwing errors directly. This ensures that errors are logged and returned to clients with appropriate HTTP status codes and messages.

- **Issue 3 — Token Cached Across Merchant Changes**
  - What was wrong or weak:
    Frontend stored token in localStorage and reused it forever. When user switched 
    merchants in dropdown, old token was still used → wrong merchant's data displayed.
  - Shape of my improvement:
    Clear token from memory and localStorage when merchant selector changes. 
    Next API call forces getToken() with new merchant ID.
  - Why this matters:
    Multi-tenant isolation is broken if tokens don't reflect current user context. 
    This was a security boundary issue.

## Feature chosen

- **Feature:** Feature A — CSV export of orders
- **Why this one and not the others:**
  Feature A was the best fit because:
  - It directly solves a real merchant need (reconciliation/accounting)
  - Feature B (webhooks) requires infrastructure I don't control (external URLs, retry queues)
  - Feature C (search filters) is complex (pagination, indexing strategy, sorting UX)
  - CSV export is scoped, testable, and touches auth/data correctly
  - It integrates cleanly with the existing DAL and auth model I just fixed
- **What I cut to ship it in budget:**
  - No streaming for massive exports (added comment for future)
  - No BOM for Unicode (uses UTF-8 which is fine for US merchants)
  - Date picker is simple date inputs, not range selector component

## Things I noticed but did NOT fix

-

## Docs / code I left alone deliberately

-

## What I'd do with another 6 hours

-
