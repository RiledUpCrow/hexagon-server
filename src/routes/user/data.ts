import { Handler } from 'express';
import Container from '../../Container';
import getProfile from './getProfile';
import ClientError from '../error/ClientError';

const data = (container: Container): Handler => async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new ClientError('You must be logged in', 401));
    }

    const result = await getProfile(container)(user);

    res.send(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default data;
