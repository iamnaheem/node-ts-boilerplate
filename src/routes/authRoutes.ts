import { Router } from 'express';
import { authController } from '@controllers/authController';
import { validateBody } from '@middleware/validation';
import { authenticateToken } from '@middleware/auth';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../schemas/authSchemas';

export const authRoutes = Router();

// Public routes
authRoutes.post(
  '/register',
  validateBody(registerSchema),
  authController.register
);

authRoutes.post(
  '/login',
  validateBody(loginSchema),
  authController.login
);

authRoutes.post(
  '/refresh',
  validateBody(refreshTokenSchema),
  authController.refreshToken
);

// Protected routes
authRoutes.get(
  '/profile',
  authenticateToken,
  authController.profile
);

authRoutes.post(
  '/logout',
  validateBody(refreshTokenSchema),
  authController.logout
); 