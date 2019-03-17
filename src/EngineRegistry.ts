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
    const engineData: EngineData = { id, adminToken, socket };
    this.engines.push(engineData);
    return engineData;
  };
}
