import bodyParser from 'body-parser';
import { Router } from 'express';
import Container from '../../Container';
import userMiddleware from '../user/userMiddleware';
import message from './message';
import editGame from './editGame';
import getInvite from './getInvite';

const gameRouter = (container: Container): Router => {
  const router = Router();

  router.use(bodyParser.json());
  router.use(userMiddleware(container));

  router.post('/message/:gameId', message(container));
  router.post('/rename/:gameId', editGame(container));
  router.get('/invite/:gameId', getInvite(container));

  return router;
};

export default gameRouter;
