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


const restful = require('./restful.dev');
function testCode(req) {
  return {
    '아사나기': 1
  };
}
api.get('/abcde', (req, res) => restful.GET(req, res, testCode));


/* @codingjoa
   라우터
*/

/* @codingjoa
   백엔드 서버 릴리즈
*/
const port = process.env.PORT ?? 6060;
app.listen(port, () => console.log('server opened.'));
