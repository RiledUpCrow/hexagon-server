import crypto from 'crypto';
import { Connection } from 'typeorm';
import WebSocket from 'ws';
import Engine from './database/Engine';
import EngineData from './EngineData';
import { randanimal } from 'randanimal';

export default class EngineRegistry {
  protected engines: EngineData[] = [];

  public constructor(protected connection: Connection) {}

  public getEngine = (id: string): EngineData | undefined => {
    return this.engines.find(e => e.entity.engineId === id);
  };

  public registerSocket = async (
    id: string,
    adminToken: string,
    authToken: string,
    socket: WebSocket,
  ): Promise<EngineData> => {
    if (this.engines.find(e => e.entity.engineId === id)) {
      throw new Error('Engine with this id already registered');
    }

    let hashedToken = crypto
      .createHash('sha256')
      .update(authToken)
      .digest('hex');

    let entity = await this.connection
      .getRepository(Engine)
      .findOne({ where: { engineId: id }, loadEagerRelations: true });

    if (!entity) {
      entity = new Engine();
      entity.adminToken = adminToken;
      entity.authToken = hashedToken;
      entity.engineId = id;
      entity.displayName = await randanimal();
      entity.open = false;
      entity.admins = [];
      entity.games = [];
      await this.connection.manager.save(entity);
      console.log('This engine is new');
    }

    if (entity.authToken !== hashedToken) {
      throw new Error('Invalid token');
    }

    const engineData: EngineData = { entity, socket };
    this.engines.push(engineData);
    return engineData;
  };

  public unregisterSocket = (id: string): void => {
    const index = this.engines.findIndex(e => e.entity.engineId === id);
    if (index < 0) {
      throw new Error('Disconnecting a non-existing engine, wtf?');
    }
    this.engines.splice(index, 1);
  };
}
