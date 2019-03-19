import { Connection } from 'typeorm';
import { Handler } from 'express';
import Joi from 'joi';
import Engine from '../../database/Engine';

const claim = (connection: Connection): Handler => async (req, res) => {
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
      adminToken: Joi.string()
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
    const { adminToken } = value;

    const engine = await connection
      .getRepository(Engine)
      .findOne({ where: { adminToken }, relations: ['admins'] });

    if (!engine) {
      res.status(400);
      res.send({
        message: 'Invalid token',
      });
      return;
    }

    engine.admins = [...engine.admins, user];

    connection.manager.save(engine);
    console.log(`User ${user.name} has claimed engine ${engine.engineId}`);
    res.send();
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send({
      message: 'Internal server error',
    });
  }
};

export default claim;
