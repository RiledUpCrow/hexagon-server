import { Handler } from 'express';
import Joi from 'joi';
import nanoid from 'nanoid';
import { randanimal } from 'randanimal';
import Container from '../../Container';
import Engine from '../../database/Engine';
import Game from '../../database/Game';
import Settings from '../../database/Settings';
import ClientError from '../error/ClientError';
import socketRequest from '../../engine/socketRequest';
import getGame from './getGame';

const createGame = (container: Container): Handler => async (
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
      .findOne({ where: { engineId } });
    if (!engine) {
      return next(new ClientError('Invalid engine ID'));
    }

    if (!user.engines.find(e => e.engineId === engineId)) {
      return next(new ClientError('Invalid engine ID'));
    }

    const engineData = container.engineRegistry.getEngine(engineId);
    if (!engineData) {
      return next(new ClientError('Engine is not online'));
    }

    const schema = Joi.object().keys({
      maxPlayers: Joi.number()
        .min(2)
        .max(16)
        .required(),
      mapWidth: Joi.number()
        .min(32)
        .max(128)
        .required(),
      mapHeight: Joi.number()
        .min(20)
        .max(80)
        .required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid JSON schema: ${errors}`));
    }

    const id = await nanoid(24);
    const invite = await nanoid(12);

    const { maxPlayers, mapWidth, mapHeight } = value;

    const settings = new Settings();
    settings.mapHeight = mapHeight;
    settings.mapWidth = mapWidth;
    settings.maxPlayers = maxPlayers;
    const game = new Game();
    game.gameId = id;
    game.displayName = await randanimal();
    game.started = false;
    game.ended = false;
    game.engine = engine;
    game.players = [user];
    game.owner = user;
    game.settings = settings;
    game.invite = invite;

    const response = await socketRequest(engineData.socket, {
      type: 'createGame',
      data: { id, maxPlayers, mapWidth, mapHeight },
    });

    if (response.type !== 'success') {
      return next(new ClientError('Engine failed to create a game'));
    }

    await container.connection.manager.save([game, settings]);

    console.log(
      `Game ${game.gameId} created on engine ${engineId} for player ${
        user.name
      }`,
    );
    res.send(getGame(container.engineRegistry)(game));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default createGame;
