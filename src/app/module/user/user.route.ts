import { Router } from 'express';
import userController from './user.controller';

const router = Router();

router.post('/register', userController.createDoctor);

const userRouter = router;
export default userRouter;
