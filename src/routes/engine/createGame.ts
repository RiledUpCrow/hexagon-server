import { Handler } from 'express';
import Joi from 'joi';
import Container from '../../Container';
import Engine from '../../database/Engine';
import User from '../../database/User';
import Game from '../../database/Game';
import Settings from '../../database/Settings';
import nanoid from 'nanoid';

const createGame = (container: Container): Handler => async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(400);
      res.send({
        message: 'You need to be logged in',
      });
      return;
    }

    const { value: engineId, error: engineIdError } = Joi.string()
      .alphanum()
      .validate(req.params.engineId);
    if (engineIdError) {
      res.status(400);
      res.send({
        message: 'Invalid engineId',
      });
      return;
    }

    const engine = await container.connection
      .getRepository(Engine)
      .findOne({ where: { engineId } });
    if (!engine) {
      res.status(400);
      res.send({
        message: 'Invalid engineId',
      });
      return;
    }

    const entireUser = await container.connection
      .getRepository(User)
      .findOne(user.id, { relations: ['engines'] });
    if (!entireUser.engines.find(e => e.engineId === engineId)) {
      res.status(400);
      res.send({
        message: 'Invalid engineId',
      });
      return;
    }

    const engineData = container.engineRegistry.getEngine(engineId);
    if (!engineData) {
      res.status(400);
      res.send({
        message: 'Engine is not online',
      });
      return;
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
      res.status(400);
      res.send({
        message: error.message,
      });
      return;
    }

    const { maxPlayers, mapWidth, mapHeight } = value;
    const settings = new Settings();
    settings.mapHeight = mapHeight;
    settings.mapWidth = mapWidth;
    settings.maxPlayers = maxPlayers;
    const game = new Game();
    game.gameId = await nanoid(24);
    game.started = false;
    game.ended = false;
    game.engine = engine;
    game.players = [user];
    game.settings = settings;

    const [savedGame] = await container.connection.manager.save([
      game,
      settings,
    ]);

    res.send({ gameId: savedGame.id });
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send({
      message: 'Internal server error',
    });
  }
};

export default createGame;
