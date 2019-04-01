import { Handler } from 'express';
import Joi from 'joi';
import Container from '../../Container';
import Game from '../../database/Game';
import ClientError from '../error/ClientError';

const renameGame = (container: Container): Handler => async (
  req,
  res,
  next,
) => {
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

    const schema = Joi.object().keys({
      name: Joi.string()
        .min(3)
        .max(24)
        .regex(/^[a-zA-Z0-9\-_]*$/)
        .required(),
    });

    const { value, error } = schema.validate(req.body);

    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid JSON schema: ${errors}`));
    }

    console.log(`User ${user} renamed game ${game.id} to ${value.name}`);
    game.displayName = value.name;

    container.connection.manager.save(game);

    res.send();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default renameGame;
