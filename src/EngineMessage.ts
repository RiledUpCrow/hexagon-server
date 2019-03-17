const engineMessageTypes = ['register'];

export { engineMessageTypes };

export interface RegisterEngineMessage {
  type: 'register';
  data: {
    id: string;
    adminToken: string;
    version: string;
  };
}

export type EngineMessage = RegisterEngineMessage;
