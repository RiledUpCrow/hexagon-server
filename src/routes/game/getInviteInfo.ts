import Container from '../../Container';
import { Handler } from 'express';
import ClientError from '../error/ClientError';
import Joi from 'joi';
import Game from '../../database/Game';
import getGame from '../engine/getGame';

const getInviteInfo = (container: Container): Handler => async (
  req,
  res,
  next,
) => {
  try {
    const schema = Joi.string()
      .alphanum()
      .required();

    const { value: token, error } = schema.validate(req.params.inviteToken);

    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid JSON schema: ${errors}`));
    }

    const game = await container.connection.manager.findOne(Game, {
      where: { invite: token },
      relations: ['players', 'engine', 'settings', 'activePlayer', 'owner'],
    });

    if (!game) {
      return next(new ClientError('Invalid invite token'));
    }

    res.send(getGame(container.engineRegistry)(game));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default getInviteInfo;
