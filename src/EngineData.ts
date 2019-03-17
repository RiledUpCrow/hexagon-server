import * as WebSocket from 'ws';

/**
 * Represents a single connected engine.
 */
export default interface EngineData {
  id: string;
  adminToken: string;
  socket: WebSocket;
}
