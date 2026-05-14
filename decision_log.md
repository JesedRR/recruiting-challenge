# Decision Log — <Jesed Robles>

> One page max. Specifics over generalities. See `SUBMISSION.md` for the prompt.

## Issues addressed

> Defects, security smells, architectural problems, missing pieces, scaling risks — anything you decided was worth your time. Be specific about *what* was wrong/weak and *why* your shape was the right one.

- **Issue 1 — Insecure Authentication (X-Merchant-Id Header)**
  - What was wrong or weak: The previous implementation trusted a plain `X-Merchant-Id` header sent by clients. This is a major security vulnerability because any client could impersonate any merchant by simply changing the header value. There's no verification that the client actually owns that merchant ID.
  - Shape of my improvement: Implemented JWT-based authentication. Clients now request a token from `/api/auth/token` endpoint, which returns a cryptographically signed JWT. The middleware validates the token signature and expiry on every request. Only a valid token can access protected endpoints.

- **Issue 2 — <short title>**
  - What was wrong or weak:
  - Shape of my improvement:
  - Alternatives I considered and rejected:

- **Issue 3 — <short title>**
  - What was wrong or weak:
  - Shape of my improvement:
  - Alternatives I considered and rejected:

## Feature chosen

- **Feature:**
- **Why this one and not the others:**
- **What I cut to ship it in budget:**

## Things I noticed but did NOT fix

-

## Docs / code I left alone deliberately

-

## What I'd do with another 6 hours

-
