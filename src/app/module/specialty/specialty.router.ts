import { Router } from 'express';
import specialtyController from './specialty.controller';

const router = Router();

router.post('/', specialtyController.createSpecialty);

const specialtyRouter = router;
export default specialtyRouter;
