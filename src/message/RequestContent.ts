import CreateGame from './CreateGame';
import Version from './Version';

interface ClientMessageRequest {
  type: 'clientMessage';
  data: any;
}

interface VersionRequest {
  type: 'version';
  data: Version;
}

interface CreateGameRequest {
  type: 'createGame';
  data: CreateGame;
}

export type RequestContent =
  | ClientMessageRequest
  | VersionRequest
  | CreateGameRequest;
