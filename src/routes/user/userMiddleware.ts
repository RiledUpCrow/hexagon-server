import { Handler } from 'express';
import Container from '../../Container';
import Token from '../../database/Token';
import ClientError from '../error/ClientError';
import crypto from 'crypto';

export default (container: Container): Handler => async (req, res, next) => {
  const bearer = req.headers.authorization;

  // no authorization header, continue without user
  if (!bearer) {
    return next();
  }

  // incorrect authorization header
  if (!bearer.startsWith('Bearer')) {
    return next(new ClientError('Only Bearer authorization is supported'));
  }

  const token = bearer.substr('Bearer '.length);
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const entity = await container.connection.getRepository(Token).findOne({
    where: { token: hashedToken },
    relations: ['user', 'user.engines', 'user.games'],
  });

  if (!entity) {
    return next(new ClientError('Invalid token'));
  }

  req.user = entity.user;

  next();
};
