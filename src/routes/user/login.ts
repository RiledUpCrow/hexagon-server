import bcrypt from 'bcrypt';
import { Handler, Response } from 'express';
import Joi from 'joi';
import nanoid from 'nanoid';
import Container from '../../Container';
import Token from '../../database/Token';
import User from '../../database/User';
import getProfile from './getProfile';
import ClientError from '../error/ClientError';

const login = (container: Container): Handler => async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid JSON schema: ${errors}`));
    }
    const { name, password } = value;

    const user = await container.connection
      .getRepository(User)
      .findOne({ name }, { relations: ['engines', 'games'] });
    if (!user) {
      return next(new ClientError('Wrong credentials'));
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return next(new ClientError('Wrong credentials'));
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
    next(error);
  }
};

export default login;
