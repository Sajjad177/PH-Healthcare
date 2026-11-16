import { Router } from 'express';
import specialtyRouter from '../module/specialty/specialty.router';
import authRouter from '../module/auth/auth.router';
import userRouter from '../module/user/user.route';

const router = Router();

router.use('/specialty', specialtyRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);

export const indexRouter = router;

//! next module is = Milestone 6 (37-12)
