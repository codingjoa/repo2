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
const teacher = express.Router();

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

/* @codingjoa
   /quarter
   GET #담당 반 조회
   POST #담당 반 만들기
   PUT #담당 반 이름 변경

   /student
   GET #반 학생 조회
   POST #반 학생 추가
   DELETE #반 학생 삭제
   PUT #반 학생 정보 수정

   /study
   GET #출석부 조회
   POST #출석부 출석 승인

   /teacher/reset
   POST #비밀번호 초기화

*/
database.use(auth0.editableSession);
database.use(auth0.touchSession);
database.get('/quarter', db.quarter.fetch);
database.post('/quarter',
  db.quarter.create,
);
database.put('/quarter', db.quarter.rename);
database.get('/student',
  db.permission.editableQuarter,
  db.student.fetch
);
database.post('/student', db.student.add);
database.delete('/student', db.student.delete);
database.put('/student', db.student.modify);
database.get('/study',
  db.permission.editableQuarter,
  db.study.fetch
);
database.post('/study',
  db.permission.editableQuarter,
  db.study.addStudy
);
database.use('/teacher', teacher);
teacher.post('/reset',
  db.permission.editableTeacher,
  db.teacher.regeneratePassword
);
teacher.put('/change',
  db.teacher.certification,
  db.teacher.changeMyPassword
);


/* @codingjoa
   /
   GET #세션 상태 확인

   /login
   POST #로그인

   /logout
   GET #로그아웃
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
