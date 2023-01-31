import { Router } from 'express';
import jobRoute from './job.route';

const router = Router();

const defaultRoutes = [
  {
    path: '/jobs',
    route: jobRoute,
  },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
