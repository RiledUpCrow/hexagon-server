import bcrypt from 'bcrypt';
import { Handler } from 'express';
import Joi from 'joi';
import nanoid from 'nanoid';
import Container from '../../Container';
import Token from '../../database/Token';
import User from '../../database/User';
import {
  emailConstraint,
  nameConstraint,
  passwordConstraint,
} from './userConstraints';
import getProfile from './getProfile';
import ClientError from '../error/ClientError';

const register = (container: Container): Handler => async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      email: emailConstraint.required(),
      name: nameConstraint.required(),
      password: passwordConstraint.required(),
    });
    const { value, error } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return next(new ClientError(`Invalid JSON schema: ${errors}`));
    }

    const { email, name, password } = value;

    const existingUser = await container.connection.manager.findOne(User, {
      where: { name },
    });

    if (existingUser) {
      return next(new ClientError('User already exists'));
    }

    const hash = await bcrypt.hash(password, 12);
    const token = await nanoid(48);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hash;
    user.engines = [];
    user.games = [];

    const tokenEntity = new Token();
    tokenEntity.token = token;
    tokenEntity.user = user;
    user.tokens = [tokenEntity];

    await container.connection.manager.save([user, tokenEntity]);

    const profile = getProfile(container.engineRegistry)(user);

    res.send({ token, profile });
    console.log(`User '${name}' registered`);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default register;
