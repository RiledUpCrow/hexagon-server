import WebSocket from 'ws';
import { WebSocketGateway, OnGatewayConnection } from '@nestjs/websockets';
import { EngineService } from './engine.service';
import EngineData from '../EngineData';
import socketRequest from './socketRequest';
import parseRegisterMessage from '../message/parseRegisterMessage';
import validateVersion from '../validateVersion';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ path: '/socket' })
export class EngineGateway implements OnGatewayConnection {
  protected readonly logger = new Logger(EngineGateway.name);

  public constructor(protected readonly engineService: EngineService) {}

  public async handleConnection(socket: WebSocket) {
    let engineData: EngineData | null = null;

    socket.on('close', () => {
      if (!engineData) {
        return;
      }
      this.logger.log(`Engine disconnected: ${engineData.entity.engineId}`);
      this.engineService.unregisterSocket(engineData.entity.engineId);
    });

    try {
      this.logger.log('Incomming connection');
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
      engineData = await this.engineService.registerSocket(
        id,
        adminToken,
        authToken,
        socket,
      );
      this.logger.log(`Registered with id ${id}`);
    } catch (error) {
      this.logger.log(`Engine error: ${error.message}`);
      socket.close();
    }
  }
}
