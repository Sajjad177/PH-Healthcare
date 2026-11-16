import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import z from 'zod';
import { envConfig } from '../../config/env';
import { TErrorResponse, TErrorSource } from '../../interfaces/error.interface';
import { handleZodError } from '../errorHelpers/handelZodError';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (envConfig.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  const errorSource: TErrorSource[] = [];
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = 'Internal Server Error';

  if (err instanceof z.ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errorSource.push(...zodError.errorSource);
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    error: err.message,
    errorSource: errorSource,
  };

  res.status(statusCode).json(errorResponse);
};
