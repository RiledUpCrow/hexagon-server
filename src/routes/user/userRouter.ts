import { Router } from 'express';
import bodyParser from 'body-parser';
import { Connection } from 'typeorm';
import register from './register';

const userRouter = (connection: Connection): Router => {
  const router = Router();

  router.use(bodyParser.json());

  router.post('/register', register(connection));
  router.post('/login', (req, res) => {});

  return router;
};

export default userRouter;
