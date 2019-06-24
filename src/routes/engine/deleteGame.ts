import { Handler } from 'express';
import Joi from 'joi';
import Container from '../../Container';
import Engine from '../../database/Engine';
import Game from '../../database/Game';
import ClientError from '../error/ClientError';
import socketRequest from '../../engine/socketRequest';

const deleteGame = (container: Container): Handler => async (
  req,
  res,
  next,
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new ClientError('You must be logged in', 401));
    }

    const { value: engineId, error: engineIdError } = Joi.string()
      .alphanum()
      .validate(req.params.engineId);
    if (engineIdError) {
      const errors = engineIdError.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid param: ${errors}`));
    }

    const engine = await container.connection
      .getRepository(Engine)
      .findOne({ where: { engineId }, relations: ['admins'] });
    if (!engine) {
      return next(new ClientError('Invalid engine ID'));
    }

    if (!user.engines.find(e => e.engineId === engineId)) {
      return next(new ClientError('Invalid engine ID'));
    }

    const engineData = container.engineRegistry.getEngine(engineId);

    const schema = Joi.object().keys({
      gameId: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid JSON schema: ${errors}`));
    }
    const { gameId } = value;

    const game = await container.connection
      .getRepository(Game)
      .findOne({ where: { gameId }, relations: ['owner'] });

    if (!game) {
      return next(new ClientError('Invalid game ID'));
    }

    let status: 'game owner' | 'engine admin';
    if (game.owner.id === user.id) {
      status = 'game owner';
    } else if (engine.admins.find(a => a.id === user.id)) {
      status = 'engine admin';
    } else {
      return next(new ClientError('Invalid game ID'));
    }

    let deletedFromEngine = false;
    if (engineData) {
      const response = await socketRequest(engineData.socket, {
        type: 'deleteGame',
        data: gameId,
      });

      if (response.type !== 'success') {
        return next(new ClientError('Engine failed to delete the game'));
      }

      deletedFromEngine = true;
    }

    await container.connection.getRepository(Game).remove(game);

    console.log(
      `Game ${game.gameId} deleted from engine ${engineId} for player ${
        user.name
      } (${status}).${
        !deletedFromEngine
          ? ' Engine was offline, will delete when it logs in.'
          : ''
      }`,
    );
    res.send();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default deleteGame;
