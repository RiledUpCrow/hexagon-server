import { Router } from 'express';
import bodyParser from 'body-parser';
import { Connection } from 'typeorm';
import register from './register';
import login from './login';

const userRouter = (connection: Connection): Router => {
  const router = Router();

  router.use(bodyParser.json());

  router.post('/register', register(connection));
  router.post('/login', login(connection));

  return router;
};

export default userRouter;
