import { NextFunction, Request, Response } from 'express';
import { envConfig } from '../../config/env';
import httpStatus from 'http-status';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (envConfig.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  const message: string = 'Internal Server Error';
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message,
  });
};
