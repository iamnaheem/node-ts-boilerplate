import { Router } from 'express';
import { userController } from '@controllers/userController';
import { validateBody, validateParams, validateQuery } from '@middleware/validation';
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
  userQuerySchema,
} from '../schemas/userSchemas';

export const userRoutes = Router();

userRoutes.get(
  '/',
  validateQuery(userQuerySchema),
  userController.getAllUsers
);
userRoutes.get(
  '/:id',
  validateParams(userParamsSchema),
  userController.getUserById
);
userRoutes.post(
  '/',
  validateBody(createUserSchema),
  userController.createUser
);
userRoutes.put(
  '/:id',
  validateParams(userParamsSchema),
  validateBody(updateUserSchema),
  userController.updateUser
);
userRoutes.delete(
  '/:id',
  validateParams(userParamsSchema),
  userController.deleteUser
); 