import { Router } from 'express';
import jobRoute from './job.route';
import securityKeyRoute from './securityKey.route';

const router = Router();

const defaultRoutes = [
  {
    path: '/jobs',
    route: jobRoute,
  },
  {
    path: '/securityKey',
    route: securityKeyRoute,
  },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
