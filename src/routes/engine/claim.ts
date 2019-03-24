import { Handler } from 'express';
import Joi from 'joi';
import Container from '../../Container';
import Engine from '../../database/Engine';
import ClientError from '../error/ClientError';
import getEngine from './getEngine';

const claim = (container: Container): Handler => async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new ClientError('You must be logged in', 401));
    }

    const schema = Joi.object().keys({
      adminToken: Joi.string()
        .alphanum()
        .required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid JSON schema: ${errors}`));
    }
    const { adminToken } = value;

    const engine = await container.connection
      .getRepository(Engine)
      .findOne({ where: { adminToken }, relations: ['admins'] });

    if (!engine) {
      return next(new ClientError('Invalid token'));
    }

    if (engine.admins.find(a => a.id === user.id)) {
      return next(new ClientError('You have already claimed this engine'));
    }

    engine.admins = [...engine.admins, user];

    await container.connection.manager.save(engine);
    console.log(`User ${user.name} has claimed engine ${engine.engineId}`);
    res.send(getEngine(container.engineRegistry)(engine));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default claim;
