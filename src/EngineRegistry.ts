import EngineData from './EngineData';
import * as WebSocket from 'ws';

export default class EngineRegistry {
  protected engines: EngineData[] = [];

  public constructor() {}

  public registerSocket = (
    id: string,
    adminToken: string,
    socket: WebSocket,
  ): EngineData => {
    if (this.engines.find(e => e.id === id)) {
      throw new Error('engine with this id already registered');
    }
    const engineData: EngineData = { id, adminToken, socket };
    this.engines.push(engineData);
    return engineData;
  };

  public unregisterSocket = (id: string): void => {
    const index = this.engines.findIndex(e => e.id === id);
    if (index < 0) {
      throw new Error('disconnecting a non-existing engine, wtf?');
    }
    this.engines.splice(index, 1);
  };
}
