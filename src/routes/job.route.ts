import { Router } from 'express';
import { jobController } from '../controllers';
import auth from '../middlewares/auth.middleware';

const router = Router();

router.route('/').post(auth(), jobController.createJob);
router.route('/:id').get(jobController.getJob);
router.route('/health').get(jobController.getHealth);
export default router;
