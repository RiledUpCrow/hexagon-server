import Game from '../../database/Game';
import EngineRegistry from '../../EngineRegistry';

export interface GameResponse {
  id: string;
  displayName: string;
  started: boolean;
  ended: boolean;
  settings: {
    maxPlayers: number;
    mapHeight: number;
    mapWidth: number;
  };
  players: string[];
  activePlayer: string | null;
  owner: string;
  online: boolean;
}

export default (registry: EngineRegistry) => (game: Game): GameResponse => {
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
