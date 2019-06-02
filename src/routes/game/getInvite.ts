import { Handler } from 'express';
import Container from '../../Container';
import Game from '../../database/Game';
import ClientError from '../error/ClientError';

const getInvite = (container: Container): Handler => async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new ClientError('You must be logged in', 401));
    }

    const gameId = req.params.gameId;

    if (!gameId) {
      return next(new ClientError('Game ID param is missing'));
    }

    const game = await container.connection.getRepository(Game).findOne({
      where: { gameId },
      relations: ['owner'],
    });

    if (!game) {
      return next(new ClientError('Invalid game ID'));
    }

    if (game.owner.id !== user.id) {
      return next(new ClientError('Invalid game ID'));
    }

    res.send({ invite: game.invite });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default getInvite;
