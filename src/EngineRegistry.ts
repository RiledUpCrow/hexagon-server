import EngineData from './EngineData';
import WebSocket from 'ws';
import { Connection } from 'typeorm';
import Engine from './database/Engine';

export default class EngineRegistry {
  protected engines: EngineData[] = [];

  public constructor(protected connection: Connection) {}

  public registerSocket = async (
    id: string,
    adminToken: string,
    socket: WebSocket,
  ): Promise<EngineData> => {
    if (this.engines.find(e => e.entity.engineId === id)) {
      throw new Error('engine with this id already registered');
    }
    let entity = await this.connection
      .getRepository(Engine)
      .findOne({ where: { engineId: id }, loadEagerRelations: true });

    if (!entity) {
      entity = new Engine();
      entity.adminToken = adminToken;
      entity.engineId = id;
      entity.admins = [];
      entity.games = [];
      await this.connection.manager.save(entity);
      console.log('This engine is new');
    }

    const engineData: EngineData = { entity, socket };
    this.engines.push(engineData);
    return engineData;
  };

  public unregisterSocket = (id: string): void => {
    const index = this.engines.findIndex(e => e.entity.engineId === id);
    if (index < 0) {
      throw new Error('disconnecting a non-existing engine, wtf?');
    }
    this.engines.splice(index, 1);
  };
}
