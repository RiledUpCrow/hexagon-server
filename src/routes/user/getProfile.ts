import Container from '../../Container';
import User from '../../database/User';
import getEngine from '../engine/getEngine';
import getGame from '../engine/getGame';

export default (container: Container) => async (partialUser: User) => {
  const user = await container.connection
    .getRepository(User)
    .findOne(partialUser.id, {
      relations: [
        'games',
        'games.engine',
        'games.settings',
        'games.activePlayer',
        'games.players',
        'games.owner',
        'engines',
        'engines.admins',
        'engines.games',
        'engines.games.engine',
        'engines.games.settings',
        'engines.games.activePlayer',
        'engines.games.players',
        'engines.games.owner',
      ],
    });

  const { name, photo, engines: enginesRaw, games: gamesRaw } = user!;

  const engines = enginesRaw.map(getEngine(container.engineRegistry));
  const games = gamesRaw.map(getGame(container.engineRegistry));

  return { name, photo, engines, games };
};
