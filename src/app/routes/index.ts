import { Router } from 'express';
import specialtyRouter from '../module/specialty/specialty.router';
import authRouter from '../module/auth/auth.router';
import userRouter from '../module/user/user.route';
import doctorRouter from '../module/doctor/doctor.route';

const router = Router();

router.use('/specialty', specialtyRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/doctor', doctorRouter);

export const indexRouter = router;

//! next module is = Milestone 6 (37-12)
