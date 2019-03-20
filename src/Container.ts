import { Connection } from 'typeorm';
import EngineRegistry from './EngineRegistry';
import EngineHandler from './EngineHandler';

/**
 * Container holds all services of the application.
 */
export default class Container {
  public readonly engineRegistry: EngineRegistry;
  public readonly engineHandler: EngineHandler;

  public constructor(public readonly connection: Connection) {
    this.engineRegistry = new EngineRegistry(connection);
    this.engineHandler = new EngineHandler(this.engineRegistry);
  }
}
