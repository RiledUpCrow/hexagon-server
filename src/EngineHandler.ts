import WebSocket from 'ws';
import EngineRegistry from './EngineRegistry';
import EngineData from './EngineData';
import parseRegisterMessage from './messageParser/parseRegisterMessage';
import validateVersion from './validateVersion';
import socketRequest from './routes/game/socketRequest';

const TIMEOUT = 5000;

class EngineHandler {
  public constructor(protected engineRegistry: EngineRegistry) {}

  /**
   * Handles connections from engine sockets.
   * @param socket the WebSocket of the server
   */
  public handleConnection = async (socket: WebSocket) => {
    let engineData = null;

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
          version: process.env.npm_package_version,
        },
      });
      // expect a register message
      const { data } = parseRegisterMessage(response);
      const { id, adminToken, version } = data;
      if (!validateVersion(version)) {
        throw new Error('Version not supported');
      }
      engineData = await this.engineRegistry.registerSocket(
        id,
        adminToken,
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
