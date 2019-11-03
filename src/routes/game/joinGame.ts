import Container from '../../Container';
import { Handler } from 'express';
import ClientError from '../error/ClientError';
import Joi from 'joi';
import Game from '../../database/Game';
import getGame from '../engine/getGame';

const joinGame = (container: Container): Handler => async (req, res, next) => {
  try {
    const { user, body } = req;
    if (!user) {
      return next(new ClientError('You must be logged in', 401));
    }

    const schema = Joi.object().keys({
      invite: Joi.string()
        .alphanum()
        .required(),
    });

    const { value, error } = schema.validate(body);

    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid JSON schema: ${errors}`));
    }

    const { invite } = value;

    const game = await container.connection.manager.findOne(Game, {
      where: { invite },
      relations: ['players', 'engine', 'settings', 'activePlayer', 'owner'],
    });

    if (!game) {
      return next(new ClientError('Invalid invite token'));
    }

    if (!game.players.find(player => player.id === user.id)) {
      game.players.push(user);
    }

    await container.connection.manager.save(game);

    res.send(getGame(container.engineRegistry)(game));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default joinGame;
