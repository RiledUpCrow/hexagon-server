import { Handler } from 'express';
import Container from '../../Container';
import User from '../../database/User';

const data = (container: Container): Handler => async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(400);
      res.send({
        message: 'You must be logged in',
      });
      return;
    }

    const {
      name,
      photo,
      engines: enginesRaw,
      games: gamesRaw,
    } = await container.connection
      .getRepository(User)
      .findOne(user.id, { relations: ['tokens', 'engines', 'games'] });

    const profile = { name, photo };
    const engines = enginesRaw.map(e => {
      const { engineId: id } = e;
      const engineData = container.engineRegistry.getEngine(id);
      return { id, online: engineData !== undefined };
    });
    const games = gamesRaw.map(g => {
      const { gameId: id } = g;
      return {
        id,
      };
    });
    const result = { profile, engines, games };

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send({
      message: 'Internal server error',
    });
  }
};

export default data;
