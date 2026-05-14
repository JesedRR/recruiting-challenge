import { Request, Response, NextFunction } from 'express';
import { HttpError } from './http-errors.js';
import { verifyToken } from './jwt.js';

export interface AuthenticatedRequest extends Request {
  merchantId?: string;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpError(401, 'Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const merchantId = verifyToken(token);

    if (!merchantId) {
      throw new HttpError(401, 'Invalid or expired token');
    }

    req.merchantId = merchantId;

    next(); 
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, 'Unauthorized'));
  }
};