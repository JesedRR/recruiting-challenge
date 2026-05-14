import { Request, Response, NextFunction } from 'express';

// Custom error handler middleware
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err); 

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
    },
  });
}

// 404 handler for unmatched routes
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    error: {
      status: 404,
      message: 'Not Found',
    },
  });
}