import bodyParser from 'body-parser';
import { Router } from 'express';
import Container from '../../Container';
import userMiddleware from '../user/userMiddleware';
import claim from './claim';
import createGame from './createGame';
import abandon from './abandon';

const engineRouter = (container: Container): Router => {
  const router = Router();

  router.use(bodyParser.json());
  router.use(userMiddleware(container));

  router.post('/claim', claim(container));
  router.post('/abandon', abandon(container));
  router.post('/createGame/:engineId', createGame(container));

  return router;
};

export default engineRouter;
