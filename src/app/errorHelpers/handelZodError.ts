import httpStatus from 'http-status';
import z from 'zod';

export const handleZodError = (err: z.ZodError) => {
  const statusCode = httpStatus.BAD_REQUEST;
  let message = 'Zod Validation Error';
  const errorSource: { path: string; message: string }[] = [];

  err.issues.forEach((issue) => {
    errorSource.push({
      path: issue.path.length > 1 ? issue.path.join('.') : issue.path[0].toString(),
      message: issue.message,
    });
  });

  return {
    success: false,
    statusCode,
    message,
    errorSource,
  };
};
