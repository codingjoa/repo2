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
const sessionOption = {
  secret: 'ky',
  resave: false,
  rolling: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: ((process.env.DEBUG === '1') ? Infinity : (1000 * 60 * 30))
  }
};
app.set('trust proxy', 1);
app.use(session(sessionOption));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', api);


/* @codingjoa
   라우터
*/
const version1 = require('./v1/router');
api.use('/v1', version1);
api.use(version1);
const development = require('./dev/router');
api.use('/dev', development);


/* @codingjoa
   에러 핸들링
*/
const errorManager = require('./errorManager.js');
api.use(errorManager);


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
