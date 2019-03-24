import { Handler } from 'express';
import Joi from 'joi';
import Container from '../../Container';
import ClientError from '../error/ClientError';

const abandon = (container: Container): Handler => async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new ClientError('You must be logged in', 401));
    }

    const schema = Joi.object().keys({
      id: Joi.string()
        .alphanum()
        .required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid param: ${errors}`));
    }
    const { id } = value;

    const engineIndex = user.engines.findIndex(e => e.engineId === id);

    if (engineIndex < 0) {
      res.status(400);
      return next(new ClientError('Invalid ID'));
    }

    const engine = user.engines.splice(engineIndex, 1)[0];

    await container.connection.manager.save(user);
    console.log(`User ${user.name} has abandoned engine ${engine.engineId}`);
    res.send();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default abandon;
