import Engine from '../../database/Engine';
import EngineRegistry from '../../EngineRegistry';
import getGame from './getGame';

export default (engineRegistry: EngineRegistry) => (engine: Engine) => {
  const { engineId, displayName, games } = engine;
  const engineData = engineRegistry.getEngine(engineId);
  return {
    id: engineId,
    online: engineData !== undefined,
    name: displayName,
    games: games.map(g => getGame(engineRegistry)(g)),
  };
};
