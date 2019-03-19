import { Handler } from 'express';
import { Connection } from 'typeorm';
import nanoid from 'nanoid';
import User from '../../database/User';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import Token from '../../database/Token';
import {
  emailConstraint,
  nameConstraint,
  passwordConstraint,
} from './userConstraints';

const register = (connection: Connection): Handler => async (req, res) => {
  try {
    const schema = Joi.object().keys({
      email: emailConstraint.required(),
      name: nameConstraint.required(),
      password: passwordConstraint.required(),
    });
    const { value, error } = schema.validate(req.body);
    if (error) {
      res.status(400);
      res.send({
        message: error.message,
      });
      return;
    }

    const { email, name, password } = value;

    const existingUser = await connection.manager.findOne(User, {
      where: { name },
    });

    if (existingUser) {
      res.status(400);
      res.send({
        message: 'User already exists',
      });
      return;
    }

    const hash = await bcrypt.hash(password, 12);
    const token = await nanoid(48);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hash;

    const tokenEntity = new Token();
    tokenEntity.token = token;
    tokenEntity.user = user;
    user.tokens = [tokenEntity];

    await connection.manager.save([user, tokenEntity]);

    res.send({ token });
    console.log(`User '${name}' registered`);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.end({
      message: 'Internal server error',
    });
  }
};

export default register;
