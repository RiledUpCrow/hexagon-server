import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Engine from './engine.entity';
import EngineData from '../EngineData';
import crypto from 'crypto';
import { randanimal } from 'randanimal';
import WebSocket from 'ws';
import { RequestContent } from '../message/RequestContent';
import { EngineResponse } from '../routes/engine/getEngine';
import socketRequest from './socketRequest';

@Injectable()
export class EngineService {
  protected engines: { [id: string]: EngineData } = {};

  public constructor(
    @InjectRepository(Engine)
    protected readonly engineRepository: Repository<Engine>,
  ) {}

  /**
   * Checks whether the engine is currently connected.
   */
  public isEngineConnected = (id: string) => {
    return Boolean(this.engines[id]);
  };

  /**
   * Sends a message to an engine with specified ID. You should check if it's
   * connected with `isEngineConnected` method, otherwise this may throw an error.
   */
  public sendToEngine = async (
    id: string,
    data: RequestContent,
  ): Promise<EngineResponse> => {
    const engine = this.engines[id];
    if (!engine) {
      throw new Error('Engine is not connected');
    }
    const { socket } = engine;
    const response = await socketRequest(socket, data);
    return response;
  };

  /**
   * Registers an engine using the provided socket as a connection.
   */
  public registerSocket = async (
    id: string,
    adminToken: string,
    authToken: string,
    socket: WebSocket,
  ): Promise<EngineData> => {
    if (this.engines[id]) {
      throw new Error('Engine with this id already registered');
    }

    let hashedToken = crypto
      .createHash('sha256')
      .update(authToken)
      .digest('hex');

    let entity = await this.engineRepository.findOne({
      where: { engineId: id },
      loadEagerRelations: true,
    });

    if (!entity) {
      entity = new Engine();
      entity.adminToken = adminToken;
      entity.authToken = hashedToken;
      entity.engineId = id;
      entity.displayName = await randanimal();
      entity.open = false;
      entity.admins = [];
      entity.games = [];
      await this.engineRepository.save(entity);
      console.log('This engine is new');
    }

    if (entity.authToken !== hashedToken) {
      throw new Error('Invalid token');
    }

    const engineData: EngineData = { entity, socket };
    this.engines[id] = engineData;
    return engineData;
  };

  /**
   * Unregisters the engine.
   */
  public unregisterSocket = (id: string): void => {
    const engine = this.engines[id];
    if (!engine) {
      throw new Error('Disconnecting a non-existing engine, wtf?');
    }
    delete this.engines[id];
  };
}
