import { Router } from 'express';
import bodyParser from 'body-parser';
import { Connection } from 'typeorm';
import claim from './claim';
import userMiddleware from '../user/userMiddleware';

const engineRouter = (connection: Connection): Router => {
  const router = Router();

  router.use(bodyParser.json());
  router.use(userMiddleware(connection));

  router.post('/claim', claim(connection));

  return router;
};

export default engineRouter;
