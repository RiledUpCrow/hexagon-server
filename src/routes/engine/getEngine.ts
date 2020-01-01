import Engine from '../../database/Engine';
import EngineRegistry from '../../EngineRegistry';
import getGame, { GameResponse } from './getGame';

export interface EngineResponse {
  id: string;
  online: boolean;
  name: string;
  games: string[];
}

export default (engineRegistry: EngineRegistry) => (
  engine: Engine,
): { engine: EngineResponse; games: GameResponse[] } => {
  const { engineId, displayName, games } = engine;
  const engineData = engineRegistry.getEngine(engineId);

  const gamesResult = games.map(g => getGame(engineRegistry)(g));

  const engineResult: EngineResponse = {
    id: engineId,
    online: engineData !== undefined,
    name: displayName,
    games: games.map(g => g.gameId),
  };

  return { engine: engineResult, games: gamesResult };
};
