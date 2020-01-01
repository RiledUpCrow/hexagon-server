import Container from '../../Container';
import User from '../../database/User';
import getEngine, { EngineResponse } from '../engine/getEngine';
import getGame, { GameResponse } from '../engine/getGame';

export interface ProfileResponse {
  name: string;
  photo: string | null;
  engines: EngineResponse[];
  games: GameResponse[];
}

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

  const engines: EngineResponse[] = [];
  const games: GameResponse[] = [];

  enginesRaw
    .map(getEngine(container.engineRegistry))
    .forEach(({ engine, games }) => {
      engines.push(engine);
      games.push(...games);
    });

  gamesRaw
    .filter(gr => !games.find(g => g.id === gr.gameId))
    .map(getGame(container.engineRegistry))
    .forEach(g => games.push(g));

  return { name, photo: !photo ? null : photo, engines, games };
};
