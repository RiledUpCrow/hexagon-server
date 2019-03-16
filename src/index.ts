import * as express from 'express';
import * as request from 'request';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });
const port = process.env.PORT || 80;
const frontendUrl = process.env.FRONTEND || 'http://localhost:3000';

app.get('/map', (req, res) => {
  res.send([]);
});

ws.on('connection', socket => {
  console.log('connected');
  socket.on('message', message => {
    console.log('Received: %s', message);
    socket.send(`Echo '${message}'`);
  });
  socket.send(JSON.stringify({ version: process.env.npm_package_version }));
});

app.get('*', (req, res) => {
  const url = frontendUrl + req.url;
  req.pipe(request(url)).pipe(res);
});

server.listen(port, () => console.log(`Server running on ${port}!`));
