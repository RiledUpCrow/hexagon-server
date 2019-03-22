import bcrypt from 'bcrypt';
import { Handler, Response } from 'express';
import Joi from 'joi';
import nanoid from 'nanoid';
import Container from '../../Container';
import Token from '../../database/Token';
import User from '../../database/User';
import getProfile from './getProfile';

const wrongCredentials = (res: Response): void => {
  res.status(400);
  res.send({
    message: 'Wrong credentials',
  });
};

const login = (container: Container): Handler => async (req, res) => {
  try {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400);
      res.send({
        message: error.message,
      });
      return;
    }
    const { name, password } = value;

    const user = await container.connection
      .getRepository(User)
      .findOne({ name }, { relations: ['engines', 'games'] });
    if (!user) {
      return wrongCredentials(res);
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return wrongCredentials(res);
    }

    const token = await nanoid(48);
    const tokenEntity = new Token();
    tokenEntity.token = token;
    tokenEntity.user = user;

    await container.connection.manager.save([user, tokenEntity]);

    const profile = getProfile(container.engineRegistry)(user);

    res.send({ token, profile });
    console.log(`User '${name}' logged in`);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send({
      message: 'Internal server error',
    });
  }
};

export default login;
