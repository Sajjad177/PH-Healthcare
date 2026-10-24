import { Router } from 'express';
import specialtyRouter from '../module/specialty/specialty.router';
import authRouter from '../module/auth/auth.router';

const router = Router();

router.use('/specialty', specialtyRouter);
router.use('/auth', authRouter);

export const indexRouter = router;

//! next module is = Milestone 6 (37-12)
