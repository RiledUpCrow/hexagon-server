import * as express from 'express';
import * as request from 'request';
import * as http from 'http';
import * as WebSocket from 'ws';
import EngineHandler from './EngineHandler';
import EngineRegistry from './EngineRegistry';

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });
const port = process.env.PORT || 80;
const frontendUrl = process.env.FRONTEND || 'http://localhost:3000';

const engineRegistry = new EngineRegistry();
const engineHandler = new EngineHandler(engineRegistry);

app.get('/map', (req, res) => {
  res.send([]);
});

ws.on('connection', engineHandler.handleConnection);

app.get('*', (req, res) => {
  const url = frontendUrl + req.url;
  req.pipe(request(url)).pipe(res);
});

server.listen(port, () => console.log(`Server running on ${port}!`));
