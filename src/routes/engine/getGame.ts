import Game from '../../database/Game';
import EngineRegistry from '../../EngineRegistry';

export default (registry: EngineRegistry) => (game: Game) => {
  const {
    gameId,
    displayName,
    started,
    ended,
    settings,
    players,
    engine,
    activePlayer,
    owner,
  } = game;
  const engineData = registry.getEngine(engine.engineId);
  return {
    id: gameId,
    displayName,
    started,
    ended,
    settings: {
      maxPlayers: settings.maxPlayers,
      mapHeight: settings.mapHeight,
      mapWidth: settings.mapWidth,
    },
    players: players.map(p => p.name),
    activePlayer: activePlayer ? activePlayer.name : null,
    owner: owner.name,
    online: engineData !== undefined,
  };
};
