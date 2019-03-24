import Engine from '../../database/Engine';
import EngineRegistry from '../../EngineRegistry';

export default (engineRegistry: EngineRegistry) => (engine: Engine) => {
  const { engineId: id } = engine;
  const engineData = engineRegistry.getEngine(id);
  return { id, online: engineData !== undefined, name: engine.displayName };
};
