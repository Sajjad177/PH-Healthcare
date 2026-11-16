import { Router } from 'express';
import doctorController from './user.controller';

const router = Router();

router.post('/register', doctorController.createDoctor);

const userRouter = router;
export default userRouter;
