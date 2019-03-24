import { Handler } from 'express';
import Joi from 'joi';
import Container from '../../Container';

const abandon = (container: Container): Handler => async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(400);
      res.send({
        message: 'You need to be logged in',
      });
      return;
    }

    const schema = Joi.object().keys({
      id: Joi.string()
        .alphanum()
        .required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400);
      res.send({
        message: error.message,
      });
      return;
    }
    const { id } = value;

    const engineIndex = user.engines.findIndex(e => e.engineId === id);

    if (engineIndex < 0) {
      res.status(400);
      res.send({
        message: 'Invalid ID',
      });
      return;
    }

    const engine = user.engines.splice(engineIndex, 1)[0];

    await container.connection.manager.save(user);
    console.log(`User ${user.name} has abandoned engine ${engine.engineId}`);
    res.send();
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send({
      message: 'Internal server error',
    });
  }
};

export default abandon;
