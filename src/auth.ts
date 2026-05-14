import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from './lib/jwt.js';

declare global {
  namespace Express {
    interface Request {
      merchantId?: string;
    }
  }
}

/**
 * JWT-based auth middleware. Expects Authorization header with Bearer token.
 * Validates the token and extracts the merchant ID.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    res.status(401).json({ error: 'missing_authorization_header' });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ error: 'invalid_authorization_format' });
    return;
  }

  const token = parts[1];
  const merchantId = verifyToken(token);

  if (!merchantId) {
    res.status(401).json({ error: 'invalid_or_expired_token' });
    return;
  }

  req.merchantId = merchantId;
  next();
}