import { Router } from 'express';
import specialtyController from './specialty.controller';

const router = Router();

router.post('/', specialtyController.createSpecialty);
router.get('/', specialtyController.getAllSpecialties);
router.put('/:id', specialtyController.updateSpecialty);
router.delete('/:id', specialtyController.deleteSpecialty);

const specialtyRouter = router;
export default specialtyRouter;
