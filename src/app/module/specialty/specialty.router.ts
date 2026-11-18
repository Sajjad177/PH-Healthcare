import { Router } from 'express';
import specialtyController from './specialty.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.post('/', specialtyController.createSpecialty);
router.get('/', checkAuth(Role.DOCTOR), specialtyController.getAllSpecialties);
router.put('/:id', specialtyController.updateSpecialty);
router.delete('/:id', specialtyController.deleteSpecialty);

const specialtyRouter = router;
export default specialtyRouter;

//! 38-12 Task
//! also check Bearer token system... i login as a doctor but i cannot access the api's.
