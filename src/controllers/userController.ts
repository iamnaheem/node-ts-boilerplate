import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { users, type User, type NewUser } from '../db/schema';
import type { ApiResponse } from '../types';
import logger from '../utils/logger';

export const userController = {
  // Get all users
  getAllUsers: async (req: Request, res: Response<ApiResponse<User[]>>) => {
    try {
      logger.info('Fetching all users');
      const allUsers = await db.select().from(users);
      logger.info({ count: allUsers.length }, 'Users retrieved successfully');
      res.status(200).json({
        success: true,
        data: allUsers,
        message: 'Users retrieved successfully',
      });
    } catch (error) {
      logger.error({ error }, 'Failed to retrieve users');
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve users',
      });
    }
  },

  // Get user by ID
  getUserById: async (req: Request, res: Response<ApiResponse<User>>) => {
    try {
      const { id } = req.params;
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(id)))
        .limit(1);

      if (user.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: user[0],
        message: 'User retrieved successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve user',
      });
    }
  },

  // Create new user
  createUser: async (req: Request, res: Response<ApiResponse<User>>) => {
    try {
      const { name, email } = req.body as Pick<NewUser, 'name' | 'email'>;

      if (!name || !email) {
        logger.warn({ body: req.body }, 'User creation failed: missing required fields');
        return res.status(400).json({
          success: false,
          error: 'Name and email are required',
        });
      }

      logger.info({ name, email }, 'Creating new user');
      const newUser = await db
        .insert(users)
        .values({ name, email })
        .returning();

      logger.info({ userId: newUser[0].id, email }, 'User created successfully');
      res.status(201).json({
        success: true,
        data: newUser[0],
        message: 'User created successfully',
      });
    } catch (error) {
      logger.error({ error, email: req.body?.email }, 'Failed to create user');
      res.status(500).json({
        success: false,
        error: 'Failed to create user',
      });
    }
  },

  // Update user
  updateUser: async (req: Request, res: Response<ApiResponse<User>>) => {
    try {
      const { id } = req.params;
      const updates = req.body as Partial<Pick<NewUser, 'name' | 'email'>>;

      const updatedUser = await db
        .update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, parseInt(id)))
        .returning();

      if (updatedUser.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: updatedUser[0],
        message: 'User updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update user',
      });
    }
  },

  // Delete user
  deleteUser: async (req: Request, res: Response<ApiResponse<null>>) => {
    try {
      const { id } = req.params;

      const deletedUser = await db
        .delete(users)
        .where(eq(users.id, parseInt(id)))
        .returning();

      if (deletedUser.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: null,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete user',
      });
    }
  },
}; 