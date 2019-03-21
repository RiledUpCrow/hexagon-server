import User from '../../database/User';
import EngineRegistry from '../../EngineRegistry';

export default (engineRegistry: EngineRegistry) => (user: User) => {
  const { name, photo, engines: enginesRaw, games: gamesRaw } = user;

  const engines = enginesRaw.map(e => {
    const { engineId: id } = e;
    const engineData = engineRegistry.getEngine(id);
    return { id, online: engineData !== undefined };
  });
  const games = gamesRaw.map(g => {
    const { gameId: id } = g;
    return {
      id,
    };
  });
  return { name, photo, engines, games };
};
