import express from 'express';
import http from 'http';
import request from 'request';
import { createConnection } from 'typeorm';
import WebSocket from 'ws';
import Container from './Container';
import databaseCredentials from './databaseCredentials';
import engineRouter from './routes/engine/engineRouter';
import userRouter from './routes/user/userRouter';

console.log('Starting the engine');

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });

const port = process.env.PORT || 80;
const frontendUrl = process.env.FRONTEND || 'http://localhost:3000';

createConnection(databaseCredentials).then(connection => {
  const container = new Container(connection);

  app.use('/user', userRouter(container));
  app.use('/engine', engineRouter(container));

  app.get('/map', (req, res) => {
    res.send([]);
  });

  ws.on('connection', container.engineHandler.handleConnection);

  app.all('*', (req, res) => {
    const url = frontendUrl + req.url;
    req.pipe(request(url)).pipe(res);
  });

  server.listen(port, () => console.log(`Server running on ${port}!`));
});
