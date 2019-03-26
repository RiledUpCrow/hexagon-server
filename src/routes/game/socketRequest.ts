import Joi from 'joi';
import nanoid from 'nanoid';
import WebSocket from 'ws';
import { RequestContent } from '../../message/RequestContent';
import ClientError from '../error/ClientError';

const socketRequest = (
  socket: WebSocket,
  data: RequestContent,
  timeoutMs: number = 10 * 1000,
): Promise<any> => {
  const result = new Promise(async (resolve, reject) => {
    try {
      const timeout: { current?: NodeJS.Timeout } = {};
      const listener: { current?: (message: string) => void } = {};

      const off = (result: { data?: any; error?: any }): void => {
        try {
          if (listener.current) {
            socket.removeListener('message', listener.current);
          }
          if (timeout.current) {
            clearTimeout(timeout.current);
          }
          const { data, error } = result;
          if (error) {
            throw error;
          }
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      const requestId = await nanoid(12);

      socket.send(
        JSON.stringify({
          id: requestId,
          content: data,
        }),
      );

      listener.current = (message: string): void => {
        try {
          const json = JSON.parse(message);
          const schema = Joi.object().keys({
            id: Joi.string().required(),
            content: Joi.any().required(),
          });

          const { value, error } = schema.validate(json);

          if (error) {
            throw new ClientError('Engine returned malformed data');
          }

          if (value.id !== requestId) {
            return;
          }

          const data = value.content;
          off({ data });
        } catch (error) {
          off({ error });
        }
      };

      socket.on('message', listener.current);
      timeout.current = setTimeout(
        () => off({ error: new ClientError('Engine timeout') }),
        timeoutMs,
      );
    } catch (error) {
      reject(error);
    }
  });

  return result;
};

export default socketRequest;
