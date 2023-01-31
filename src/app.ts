import express, { Request, Response, NextFunction, Application } from 'express';
import routes from './routes';

const app: Application = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// v1 api routes
app.use('/', routes);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(Error('Not found'));
});

export default app;
