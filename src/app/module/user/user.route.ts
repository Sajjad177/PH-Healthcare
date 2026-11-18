import { Router } from 'express';
import userController from './user.controller';
import { validateRequest } from '../../middleware/validatedRequest';
import validationSchemas from './user.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(validationSchemas.createDoctorZodSchema),
  userController.createDoctor,
);

router.post('/admin', userController.createAdmin);

const userRouter = router;
export default userRouter;
