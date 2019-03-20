import bodyParser from 'body-parser';
import { Router } from 'express';
import Container from '../../Container';
import data from './data';
import login from './login';
import register from './register';
import userMiddleware from './userMiddleware';

const userRouter = (container: Container): Router => {
  const router = Router();

  router.use(bodyParser.json());

  router.post('/register', register(container));
  router.post('/login', login(container));

  router.use(userMiddleware(container));

  router.get('/data', data(container));

  return router;
};

export default userRouter;
