import { ErrorRequestHandler } from 'express';
import ClientError from './ClientError';

const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ClientError) {
    res.status(err.status);
    res.send({
      message: err.message,
    });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400);
    res.send({
      message: 'Invalid JSON in request body',
    });
    return;
  }

  res.status(500);
  res.send({
    message: 'Internal server error',
  });
};

export default errorHandler;
