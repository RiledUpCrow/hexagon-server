import WebSocket from 'ws';
import Engine from './database/Engine';

/**
 * Represents a single connected engine.
 */
export default interface EngineData {
  entity: Engine;
  socket: WebSocket;
}
