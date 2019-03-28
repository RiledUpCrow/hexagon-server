const engineMessageTypes = ['register'];

export { engineMessageTypes };

export interface RegisterEngineMessage {
  type: 'register';
  data: {
    id: string;
    name: string;
    adminToken: string;
    authToken: string;
    version: string;
  };
}

export type EngineMessage = RegisterEngineMessage;
