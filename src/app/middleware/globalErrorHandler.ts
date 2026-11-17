import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import z from 'zod';
import { envConfig } from '../../config/env';
import { TErrorResponse, TErrorSource } from '../../interfaces/error.interface';
import { handleZodError } from '../errorHelpers/handelZodError';
import AppError from '../errorHelpers/AppError';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (envConfig.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  const errorSource: TErrorSource[] = [];
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = 'Internal Server Error';
  let stack: string | undefined = undefined;

  if (err instanceof z.ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errorSource.push(...zodError.errorSource);
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSource.push({ path: req.originalUrl, message: err.message });
  } else if (err instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSource.push({ path: req.originalUrl, message: err.message });
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    error: err.message,
    stack: envConfig.NODE_ENV === 'development' ? stack : undefined,
    errorSource: envConfig.NODE_ENV === 'development' ? errorSource : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
