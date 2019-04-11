import { Handler } from 'express';
import Joi from 'joi';
import Container from '../../Container';
import ClientError from '../error/ClientError';

const rename = (container: Container): Handler => async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new ClientError('You must be logged in', 401));
    }

    const schema = Joi.string()
      .alphanum()
      .required();
    const { error, value } = schema.validate(req.params.engineId);
    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid param: ${errors}`));
    }
    const id = value;

    const engine = user.engines.find(e => e.engineId === id);

    if (!engine) {
      res.status(400);
      return next(new ClientError('Invalid ID'));
    }

    const bodySchema = Joi.object().keys({
      name: Joi.string()
        .min(3)
        .max(24)
        .regex(/^[a-zA-Z0-9\-_\ ]*$/)
        .required(),
    });
    const { error: bodyError, value: bodyValue } = bodySchema.validate(
      req.body,
    );
    if (bodyError) {
      const errors = bodyError.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid JSON schema: ${errors}`));
    }
    const { name } = bodyValue;

    const oldName = engine.displayName;
    engine.displayName = name;

    const activeEngine = container.engineRegistry.getEngine(engine.engineId);
    if (activeEngine) {
      activeEngine.entity.displayName = name;
    }

    await container.connection.manager.save(engine);

    console.log(
      `User ${user.name} has renamed engine ${
        engine.engineId
      } from ${oldName} to ${name}`,
    );
    res.send();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default rename;
