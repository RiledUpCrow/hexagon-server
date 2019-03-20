import { Handler } from 'express';
import Container from '../../Container';
import User from '../../database/User';

const data = (container: Container): Handler => async (req, res) => {
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
    const { id } = e;
    return { id };
  });
  const games = gamesRaw.map(g => {
    const { id, players } = g;
    return {
      id,
      players: players.length,
    };
  });
  const result = { profile, engines, games };

  res.send(result);
};

export default data;
