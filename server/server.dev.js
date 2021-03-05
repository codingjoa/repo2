const express = require('express');
const app = express();
const api = express.Router();
const db = require('./poolManager');


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
const development = require('./dev/router.dev');
api.use(development);
//api.use('/dev', development);


/* @codingjoa
   백엔드 서버 릴리즈
*/
const port = process.env.PORT ?? 6060;
(async () => {
  // DB 연결 실패시 restAPI 서버를 실행시키지 않습니다.
  (await db.Boot()) && app.listen(port, () => console.log('server opened.'));
})();
