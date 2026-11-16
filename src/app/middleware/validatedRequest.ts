import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validateRequest = <T extends z.ZodType>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!parsedResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsedResult.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const validatedData = parsedResult.data as {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };

    if (validatedData.body !== undefined) {
      req.body = validatedData.body;
    }

    next();
  };
};
