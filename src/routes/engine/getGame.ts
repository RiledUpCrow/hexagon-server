import Game from '../../database/Game';
import EngineRegistry from '../../EngineRegistry';

export default (registry: EngineRegistry) => (game: Game) => {
  const { gameId, started, ended, settings, players, engine } = game;
  const engineData = registry.getEngine(engine.engineId);
  return {
    id: gameId,
    started,
    ended,
    settings: {
      maxPlayers: settings.maxPlayers,
      mapHeight: settings.mapHeight,
      mapWidth: settings.mapWidth,
    },
    players: players.map(p => p.name),
    online: engineData !== undefined,
  };
};
