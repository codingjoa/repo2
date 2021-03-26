const http = require('http');
const express = require('express');
const app = express();
const api = express.Router();
const { pool } = require('./poolManager');


/* @codingjoa
   미들웨어 라이브러리
*/
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(session({
  secret: 'ky',
  resave: false,
  rolling: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 30 }
}));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', api);


/* @codingjoa
   라우터
*/
const version1 = require('./v1/router');
api.use('/v1', version1);
api.use(version1);


/* @codingjoa
   백엔드 서버 릴리즈
*/
const port = process.env.PORT ?? 3307;
const server = http.createServer(app);
(async () => {
  server.listen(port, () => console.log('server opened.'));
})();


/* Linux Signal */
const toStop = () => {
  pool.end();
  server.close(() => console.log('server closed.'));
};
process.on('SIGINT', toStop);
process.on('SIGHUP', toStop);
