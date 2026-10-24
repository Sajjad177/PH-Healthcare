import { Router } from 'express';
import specialtyRouter from '../module/specialty/specialty.router';

const router = Router();

router.use('/specialty', specialtyRouter);

export const indexRouter = router;
