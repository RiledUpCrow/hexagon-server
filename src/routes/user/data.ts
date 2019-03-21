import { Handler } from 'express';
import Container from '../../Container';
import getProfile from './getProfile';

const data = (container: Container): Handler => async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(400);
      res.send({
        message: 'You must be logged in',
      });
      return;
    }

    const result = getProfile(container.engineRegistry)(user);

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send({
      message: 'Internal server error',
    });
  }
};

export default data;
