import WebSocket from 'ws';
import EngineRegistry from './EngineRegistry';
import EngineData from './EngineData';
import parseRegisterMessage from './messageParser/parseRegisterMessage';
import validateVersion from './validateVersion';

const TIMEOUT = 5000;

class EngineHandler {
  public constructor(protected engineRegistry: EngineRegistry) {}

  /**
   * Handles connections from engine sockets.
   * @param socket the WebSocket of the server
   */
  public handleConnection = (socket: WebSocket): void => {
    console.log('incomming connection');

    // send the server version to the engine
    socket.send(JSON.stringify({ version: process.env.npm_package_version }));

    // drop connection if the engine doesn't registers itself
    let engineData: EngineData = null;
    const timeout = setTimeout(() => {
      if (!engineData) {
        console.log('timeout expired without engine registering');
        socket.close();
      }
    }, TIMEOUT);

    // handle incomming messages
    socket.on('message', async data => {
      try {
        const message = JSON.parse(data.toString());
        if (engineData) {
          console.log('message from', engineData.entity.engineId);
          // TODO: handle message
        } else {
          console.log('incoming registration');
          // expect a register message
          const { data } = parseRegisterMessage(message);
          const { id, adminToken, version } = data;
          if (!validateVersion(version)) {
            throw new Error('version not supported');
          }
          engineData = await this.engineRegistry.registerSocket(
            id,
            adminToken,
            socket,
          );
          clearTimeout(timeout);
          console.log('registered with id', id);
          socket.send('registered');
        }
      } catch (error) {
        console.error(error);
        // TODO: do something here...
      }
    });

    socket.on('close', () => {
      if (!engineData) {
        return;
      }
      console.log('engine disconnected:', engineData.entity.engineId);
      this.engineRegistry.unregisterSocket(engineData.entity.engineId);
    });
  };
}

export default EngineHandler;
