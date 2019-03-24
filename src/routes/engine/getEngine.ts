import Engine from '../../database/Engine';
import EngineRegistry from '../../EngineRegistry';

export default (engineRegistry: EngineRegistry) => (engine: Engine) => {
  const { engineId, displayName } = engine;
  const engineData = engineRegistry.getEngine(engineId);
  return { id: engineId, online: engineData !== undefined, name: displayName };
};
