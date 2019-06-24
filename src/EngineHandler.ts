import WebSocket from 'ws';
import EngineRegistry from './EngineRegistry';
import parseRegisterMessage from './message/parseRegisterMessage';
import validateVersion from './validateVersion';
import socketRequest from './engine/socketRequest';
import EngineData from './EngineData';

class EngineHandler {
  public constructor(protected engineRegistry: EngineRegistry) {}

  /**
   * Handles connections from engine sockets.
   * @param socket the WebSocket of the server
   */
  public handleConnection = async (socket: WebSocket) => {
    let engineData: EngineData | null = null;

    socket.on('close', () => {
      if (!engineData) {
        return;
      }
      console.log('Engine disconnected:', engineData.entity.engineId);
      this.engineRegistry.unregisterSocket(engineData.entity.engineId);
    });

    try {
      console.log('Incomming connection');
      const response = await socketRequest(socket, {
        type: 'version',
        data: {
          version: '0.1.0',
        },
      });
      // expect a register message
      const { data } = parseRegisterMessage(response);
      const { id, adminToken, authToken, version } = data;
      if (!validateVersion(version)) {
        throw new Error('Version not supported');
      }
      engineData = await this.engineRegistry.registerSocket(
        id,
        adminToken,
        authToken,
        socket,
      );
      console.log('Registered with id', id);
    } catch (error) {
      console.log('Engine error:', error.message);
      socket.close();
    }
  };
}

export default EngineHandler;
