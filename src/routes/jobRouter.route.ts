import { Router } from 'express';
import { jobController } from '../controllers';

const router = Router();

router.route('/').post(jobController.createJob);

export default router;
