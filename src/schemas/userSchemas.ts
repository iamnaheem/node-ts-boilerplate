import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim()
    .optional(),
  isActive: z.boolean().optional(),
});

export const userParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a positive integer'),
});

export const userQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().max(100).optional(),
  isActive: z
    .string()
    .regex(/^(true|false)$/)
    .transform(val => val === 'true')
    .optional(),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserParams = z.infer<typeof userParamsSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>; 