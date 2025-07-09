import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@db/connection';
import { users, refreshTokens, type SafeUser } from '@db/schema';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, getTokenExpirationTime } from '@utils/jwt';
import type { ApiResponse } from '../types';
import type { RegisterInput, LoginInput, RefreshTokenInput } from '../schemas/authSchemas';
import logger from '@utils/logger';

interface AuthResponse {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

export const authController = {
  // Register new user
  register: async (req: Request, res: Response<ApiResponse<AuthResponse>>) => {
    try {
      const { name, email, password } = req.body as RegisterInput;

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        logger.warn({ email }, 'Registration failed: user already exists');
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists',
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await db
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
        })
        .returning();

      const user = newUser[0];
      const { password: _, ...safeUser } = user; // Remove password from response

      // Generate tokens
      const accessToken = generateAccessToken(safeUser);
      const refreshToken = generateRefreshToken(safeUser);

      // Store refresh token
      await db.insert(refreshTokens).values({
        userId: user.id,
        token: refreshToken,
        expiresAt: getTokenExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
      });

      logger.info({ userId: user.id, email }, 'User registered successfully');

      res.status(201).json({
        success: true,
        data: {
          user: safeUser,
          accessToken,
          refreshToken,
        },
        message: 'User registered successfully',
      });
    } catch (error) {
      logger.error({ error, email: req.body?.email }, 'Failed to register user');
      res.status(500).json({
        success: false,
        error: 'Failed to register user',
      });
    }
  },

  // Login user
  login: async (req: Request, res: Response<ApiResponse<AuthResponse>>) => {
    try {
      const { email, password } = req.body as LoginInput;

      // Find user
      const foundUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (foundUsers.length === 0) {
        logger.warn({ email }, 'Login failed: user not found');
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
      }

      const user = foundUsers[0];

      // Check if user is active
      if (!user.isActive) {
        logger.warn({ userId: user.id, email }, 'Login failed: user account is inactive');
        return res.status(401).json({
          success: false,
          error: 'Account is inactive',
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        logger.warn({ userId: user.id, email }, 'Login failed: invalid password');
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
      }

      const { password: _, ...safeUser } = user;

      // Generate tokens
      const accessToken = generateAccessToken(safeUser);
      const refreshToken = generateRefreshToken(safeUser);

      // Store refresh token
      await db.insert(refreshTokens).values({
        userId: user.id,
        token: refreshToken,
        expiresAt: getTokenExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
      });

      logger.info({ userId: user.id, email }, 'User logged in successfully');

      res.status(200).json({
        success: true,
        data: {
          user: safeUser,
          accessToken,
          refreshToken,
        },
        message: 'Logged in successfully',
      });
    } catch (error) {
      logger.error({ error, email: req.body?.email }, 'Failed to login user');
      res.status(500).json({
        success: false,
        error: 'Failed to login',
      });
    }
  },

  // Refresh access token
  refreshToken: async (req: Request, res: Response<ApiResponse<{ accessToken: string; refreshToken: string }>>) => {
    try {
      const { refreshToken: token } = req.body as RefreshTokenInput;

      // Verify refresh token
      const payload = verifyRefreshToken(token);
      if (!payload) {
        return res.status(403).json({
          success: false,
          error: 'Invalid refresh token',
        });
      }

      // Check if token exists in database
      const storedTokens = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token))
        .limit(1);

      if (storedTokens.length === 0) {
        logger.warn({ userId: payload.userId }, 'Refresh token not found in database');
        return res.status(403).json({
          success: false,
          error: 'Invalid refresh token',
        });
      }

      const storedToken = storedTokens[0];

      // Check if token is expired
      if (new Date() > storedToken.expiresAt) {
        await db.delete(refreshTokens).where(eq(refreshTokens.id, storedToken.id));
        return res.status(403).json({
          success: false,
          error: 'Refresh token expired',
        });
      }

      // Get user
      const foundUsers = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      if (foundUsers.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'User not found',
        });
      }

      const user = foundUsers[0];
      const { password: _, ...safeUser } = user;

      // Generate new tokens
      const accessToken = generateAccessToken(safeUser);
      const newRefreshToken = generateRefreshToken(safeUser);

      // Delete old refresh token and create new one
      await db.delete(refreshTokens).where(eq(refreshTokens.id, storedToken.id));
      await db.insert(refreshTokens).values({
        userId: user.id,
        token: newRefreshToken,
        expiresAt: getTokenExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
      });

      logger.info({ userId: user.id }, 'Tokens refreshed successfully');

      res.status(200).json({
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
        message: 'Tokens refreshed successfully',
      });
    } catch (error) {
      logger.error({ error }, 'Failed to refresh token');
      res.status(500).json({
        success: false,
        error: 'Failed to refresh token',
      });
    }
  },

  // Get current user profile
  profile: async (req: Request, res: Response<ApiResponse<SafeUser>>) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const foundUsers = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user.userId))
        .limit(1);

      if (foundUsers.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      const user = foundUsers[0];
      const { password: _, ...safeUser } = user;

      res.status(200).json({
        success: true,
        data: safeUser,
        message: 'Profile retrieved successfully',
      });
    } catch (error) {
      logger.error({ error, userId: req.user?.userId }, 'Failed to get profile');
      res.status(500).json({
        success: false,
        error: 'Failed to get profile',
      });
    }
  },

  // Logout user (invalidate refresh token)
  logout: async (req: Request, res: Response<ApiResponse<null>>) => {
    try {
      const { refreshToken: token } = req.body as RefreshTokenInput;

      // Delete refresh token from database
      await db.delete(refreshTokens).where(eq(refreshTokens.token, token));

      logger.info({ userId: req.user?.userId }, 'User logged out successfully');

      res.status(200).json({
        success: true,
        data: null,
        message: 'Logged out successfully',
      });
    } catch (error) {
      logger.error({ error, userId: req.user?.userId }, 'Failed to logout');
      res.status(500).json({
        success: false,
        error: 'Failed to logout',
      });
    }
  },
}; 