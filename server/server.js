const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const auth0 = require('./auth');

const app = express();
const port = process.env.PORT || 3307;

const router = express.Router();
const database = express.Router();
const auth = express.Router();
const test = express.Router();

// 세션
app.use(session({
  secret: 'ky',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 10 }
}));

app.use(cors());
app.use(bodyParser.json());
app.use('/api', router);
router.use('/db', database); // /api/db/
router.use('/auth', auth); // /api/auth/
router.use('/test', test); // /api/test/

//test.use('/', auth0.getSession);
test.post('/reset', db.teacher.regeneratePassword);

//test.post('/reset', db.permission.editableQuarter);
//test.post('/reset', db.student.add);
/*
test.post('/', db.quarter.create);
test.get('/', db.quarter.fetch);
test.put('/', db.quarter.rename);
test.post('/check', db.studyChecking.check);
test.get('/check', db.studyChecking.fetch);
*/


// 학생 조회
database.get('/quarter', db.quarter.fetch);
/* @codingjoa
   아래의 링크는 더 이상 작동하지 않음.
*/
database.get('/', db.student.fetch);
// 학생 삭제
database.delete('/:sid', db.student.delete);
// 학생 수정
database.put('/:sid', db.student.modify);
// 학생 출석 체크 조회 일단 :sid, req.params.sid 지우고 실행
//database.post('/', db.study.student);
// 학생 출석체크 INSERT
//database.post('/:sid', db.study.insert);

/* @codingjoa
로그인/로그아웃
세션 상태 확인
*/
auth.get('/', 
  auth0.touchSession,
  (req, res) => {
    console.log(req.session.user);
    res.json(req.session.user ?? { tid: null, id: null, uid: null, signIn: null });
  }
);
auth.post('/login',
  auth0.isEmpty,
  db.teacher.certification,
  auth0.createSession
);
auth.get('/logout',
  auth0.editableSession,
  auth0.deleteSession
);

/* @codingjoa
   백엔드 서버 릴리즈
*/
app.listen(port, ()=>{
    console.log('server opened.');
})
