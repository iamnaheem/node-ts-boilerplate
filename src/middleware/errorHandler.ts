import { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types';
import logger from '@utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  logger.error({ err, req: { method: req.method, url: req.url } }, 'Request error');

  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    ...(isDevelopment && { details: err.message }),
  });
};

export const notFound = (req: Request, res: Response<ApiResponse>) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
}; 