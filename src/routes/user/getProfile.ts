import User from '../../database/User';
import EngineRegistry from '../../EngineRegistry';
import getEngine from '../engine/getEngine';
import getGame from '../engine/getGame';

export default (engineRegistry: EngineRegistry) => (user: User) => {
  const { name, photo, engines: enginesRaw, games: gamesRaw } = user;

  const engines = enginesRaw.map(getEngine(engineRegistry));
  const games = gamesRaw.map(getGame(engineRegistry));
  return { name, photo, engines, games };
};
