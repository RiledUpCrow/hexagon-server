import * as express from 'express';
import * as request from 'request';

const app = express();
const port = process.env.PORT || 80;
const frontendUrl = process.env.FRONTEND || 'http://localhost:3000';

app.listen(port, () => console.log(`Server running on ${port}!`));

app.get('*', (req, res) => {
  const url = frontendUrl + req.url;
  req.pipe(request(url)).pipe(res);
});
