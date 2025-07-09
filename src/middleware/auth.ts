import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '@utils/jwt';
import type { ApiResponse } from '../types';
import logger from '@utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn({ url: req.url, method: req.method }, 'Access token missing');
    res.status(401).json({
      success: false,
      error: 'Access token required',
    });
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    logger.warn({ url: req.url, method: req.method }, 'Invalid access token');
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
    return;
  }

  req.user = payload;
  next();
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        { 
          userId: req.user.userId, 
          userRole: req.user.role, 
          requiredRoles: roles,
          url: req.url 
        },
        'Insufficient permissions'
      );
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');
export const requireUser = requireRole('user', 'admin');

export const optionalAuth = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}; 