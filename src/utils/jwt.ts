import jwt from 'jsonwebtoken';
import { SafeUser } from '@db/schema';
import logger from '@utils/logger';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (user: SafeUser): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
};

export const generateRefreshToken = (user: SafeUser): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as any);
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.warn({ error: errorMessage }, 'Access token verification failed');
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.warn({ error: errorMessage }, 'Refresh token verification failed');
    return null;
  }
};

export const getTokenExpirationTime = (expiresIn: string): Date => {
  const now = new Date();
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  
  if (!match) {
    throw new Error('Invalid expires in format');
  }
  
  const [, amount, unit] = match;
  const milliseconds: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  
  const multiplier = milliseconds[unit];
  if (!multiplier) {
    throw new Error('Invalid time unit');
  }
  
  return new Date(now.getTime() + parseInt(amount) * multiplier);
}; 