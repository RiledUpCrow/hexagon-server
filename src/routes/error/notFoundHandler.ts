import { Handler } from 'express';
import ClientError from './ClientError';

const notFoundHandler: Handler = (req, res, next): void => {
  next(new ClientError('Not found', 404));
};

export default notFoundHandler;
