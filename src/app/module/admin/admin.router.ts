import { Router } from 'express';
import adminController from './admin.controller';
const router = Router();

router.get('/', adminController.getAllAdmin);
router.get('/:id', adminController.getSingleAdmin);

const adminRouter = router;
export default adminRouter;
