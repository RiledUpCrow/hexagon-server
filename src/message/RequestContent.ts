import CreateGame from './CreateGame';
import Version from './Version';
import { DeleteGame } from './DeleteGame';

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

interface DeleteGameRequest {
  type: 'deleteGame';
  data: DeleteGame;
}

export type RequestContent =
  | ClientMessageRequest
  | VersionRequest
  | CreateGameRequest
  | DeleteGameRequest;
