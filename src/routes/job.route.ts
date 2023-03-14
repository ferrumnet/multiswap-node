import { Router } from 'express';
import { jobController } from '../controllers';

const router = Router();

router.route('/').post(jobController.createJob);
router.route('/:id').get(jobController.getJob);
router.route('/health').get(jobController.getHealth);
export default router;
