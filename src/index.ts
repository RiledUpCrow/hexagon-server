import express from 'express';
import http from 'http';
import { createConnection } from 'typeorm';
import WebSocket from 'ws';
import Container from './Container';
import databaseCredentials from './databaseCredentials';
import engineRouter from './routes/engine/engineRouter';
import errorHandler from './routes/error/errorHandler';
import userRouter from './routes/user/userRouter';
import notFoundHandler from './routes/error/notFoundHandler';

console.log('Starting the engine');

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server, path: '/socket' });

const port = process.env.PORT || 80;

createConnection(databaseCredentials).then(connection => {
  const container = new Container(connection);

  app.use('/api/user', userRouter(container));
  app.use('/api/engine', engineRouter(container));
  app.use(notFoundHandler);
  app.use(errorHandler);

  ws.on('connection', container.engineHandler.handleConnection);

  server.listen(port, () => console.log(`Server running on ${port}!`));
});
