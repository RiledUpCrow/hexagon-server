import CreateGame from './CreateGame';
import Version from './Version';

interface ClientMessageContent {
  gameId: string;
  playerId: string;
  content: any;
}

interface ClientMessageRequest {
  type: 'clientMessage';
  data: ClientMessageContent;
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
