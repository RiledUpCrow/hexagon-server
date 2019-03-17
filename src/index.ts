import express from 'express';
import request from 'request';
import http from 'http';
import WebSocket from 'ws';
import EngineHandler from './EngineHandler';
import EngineRegistry from './EngineRegistry';
import { createConnection } from 'typeorm';
import databaseCredentials from './databaseCredentials';

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });

const port = process.env.PORT || 80;
const frontendUrl = process.env.FRONTEND || 'http://localhost:3000';

createConnection(databaseCredentials).then(connection => {
  const engineRegistry = new EngineRegistry(connection);
  const engineHandler = new EngineHandler(engineRegistry);

  app.get('/map', (req, res) => {
    res.send([]);
  });

  ws.on('connection', engineHandler.handleConnection);

  app.all('*', (req, res) => {
    const url = frontendUrl + req.url;
    req.pipe(request(url)).pipe(res);
  });

  server.listen(port, () => console.log(`Server running on ${port}!`));
});
