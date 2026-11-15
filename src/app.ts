import express, { Application, Request, Response } from 'express';
import { indexRouter } from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import notFoundMiddleware from './app/middleware/notFound';

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/api/v1', indexRouter);

// Basic route
app.get('/', async (req: Request, res: Response) => {
  res.send('Hello, world! This is the Express server running with TypeScript.');
});

app.use(globalErrorHandler);
app.use(notFoundMiddleware);

export default app;
