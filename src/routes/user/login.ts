import { Connection } from 'typeorm';
import { Handler, Response } from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import nanoid from 'nanoid';
import { nameConstraint, passwordConstraint } from './userConstraints';
import User from '../../database/User';
import Token from '../../database/Token';

const wrongCredentials = (res: Response): void => {
  res.status(400);
  res.send({
    message: 'Wrong credentials',
  });
};

const login = (connection: Connection): Handler => async (req, res) => {
  try {
    const schema = Joi.object().keys({
      name: nameConstraint.required(),
      password: passwordConstraint.required(),
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

    const user = await connection.getRepository(User).findOne({ name });
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

    await connection.manager.save([user, tokenEntity]);

    res.send({ token });
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
