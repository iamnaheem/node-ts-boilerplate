import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import type { ApiResponse } from '../types';
import logger from '@utils/logger';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData; // Replace with validated/transformed data
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn({ errors: validationErrors, body: req.body }, 'Body validation failed');

        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        });
      }

      logger.error({ error }, 'Unexpected validation error');
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

export const validateParams =
  (schema: ZodSchema) =>
  (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.params);
      req.params = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn({ errors: validationErrors, params: req.params }, 'Params validation failed');

        return res.status(400).json({
          success: false,
          error: 'Invalid parameters',
          details: validationErrors,
        });
      }

      logger.error({ error }, 'Unexpected validation error');
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn({ errors: validationErrors, query: req.query }, 'Query validation failed');

        return res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: validationErrors,
        });
      }

      logger.error({ error }, 'Unexpected validation error');
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }; 