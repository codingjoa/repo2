/*
const fs = require('fs');
const https = require('https');
*/
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = process.env.PORT ?? 3307;

const router = express.Router();
const database = express.Router();
const auth = express.Router();

const quarter = express.Router();
const student = express.Router();
const study = express.Router();
const teacher = express.Router();
const me = express.Router();

app.use(session({
  secret: 'ky',
  resave: false,
  rolling: true,
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

   /teacher
   GET #선생님 전체 보기
   POST #선생님 생성

   /teacher/@me
   GET #자신의 정보 조회
   PUT #자신의 비밀번호 변경

   /teacher/reset
   POST #비밀번호 초기화
*/
database.use(db.permission.editableSession);
//database.use(.touchSession);

database.use('/quarter', quarter);
quarter.get('/', db.fetch.quarters);
quarter.post('/', db.create.quarter);
quarter.use('/:qid', db.permission.editableQuarter);
quarter.get('/:qid', db.fetch.students);
quarter.put('/:qid', db.modify.quarter);
quarter.delete('/:qid', db.remove.quarter);

database.use('/student', student);
student.post('/', db.create.student);
student.use('/:stid', db.permission.editableStudent);
student.put('/:stid', db.modify.student);
student.patch('/:stid', db.modify.studentUniqueness);
student.delete('/:stid', db.remove.student);

/* study
   반을 관리하는 선생님만 접근할 수 있음(editableQuarter)
   GET 
*/
database.use('/study', study);
study.get('/', 
  db.permission.editableQuarter,
  db.fetch.study
);
study.post('/',
  db.permission.editableQuarter,
  db.create.study
);
study.patch('/:sid', db.modify.study);

/* teacher
   선생님을 관리하는 선생님만 접근할 수 있음(editableTeacher)
   GET
   1. 선생님 정보 조회

   POST
   1. 선생님 정보 생성
   2. 비밀번호 초기화

   DELETE
   1. 선생님 정보 삭제
*/
database.use('/teacher', teacher);
teacher.use(db.permission.editableTeacher);
teacher.get('/', db.fetch.teachers);
teacher.post('/',
  db.create.teacher,
  db.password.regeneratePassword
);
teacher.put('/:tid', db.modify.teacher)
teacher.delete('/:tid', db.remove.teacher);
teacher.post('/reset/:tid',
  db.password.regeneratePassword,
  db.password.updateTimeForPasswordChange
);

/* /api/db/me
   로그인한 선생님 자신의 정보에 접근
   GET /
   1. 선생님 정보를 불러옴

   PUT /
   1. 인증
   2. 비밀번호 변경
   3. 비밀번호 변경 시간 수정
*/
database.use('/me', me);
me.get('/', db.fetch.me);
me.put('/',
  db.password.certification,
  db.password.changeMyPassword,
  db.password.updateTimeForPasswordChange
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
  (req, res) => {
    console.log(req.session.user);
    res.json(req.session.user ?? { tid: null, id: null, uid: null, signIn: null, op: null });
  }
);
auth.post('/login',
  db.password.certification,
  db.permission.authorization
);
auth.get('/logout',
  db.permission.editableSession,
  db.permission.unauthorization
);

/* @codingjoa
   백엔드 서버 릴리즈
*/
app.listen(port, ()=>{
    console.log('server opened.');
})
/*
https.createServer({
  key: fs.readFileSync('/home/ky/ky/server/private.pem'),
  cert: fs.readFileSync('/home/ky/ky/server/public.pem')
}, app).listen(port, ()=>{
    console.log('server opened.');
})
*/
