import { Handler } from 'express';
import { Connection } from 'typeorm';
import Token from '../../database/Token';

export default (connection: Connection): Handler => async (req, res, next) => {
  const bearer = req.headers.authorization;

  // no authorization header, continue without user
  if (!bearer) {
    next();
  }

  // incorrect authorization header
  if (!bearer.startsWith('Bearer')) {
    res.status(400);
    res.send({
      message: 'Only Bearer authorization is supported',
    });
    return;
  }

  const token = bearer.substr('Bearer '.length);

  const entity = await connection
    .getRepository(Token)
    .findOne({ where: { token }, relations: ['user'] });

  if (!entity) {
    res.status(400);
    res.send({
      message: 'Invalid token',
    });
    return;
  }

  req.user = entity.user;

  next();
};
