import bodyParser from 'body-parser';
import { Router } from 'express';
import Container from '../../Container';
import userMiddleware from '../user/userMiddleware';
import claim from './claim';

const engineRouter = (container: Container): Router => {
  const router = Router();

  router.use(bodyParser.json());
  router.use(userMiddleware(container));

  router.post('/claim', claim(container));

  return router;
};

export default engineRouter;
