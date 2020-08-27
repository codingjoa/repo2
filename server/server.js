const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3307;

const router = express.Router();
const database = express.Router();
const auth = express.Router();

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

let uid = 0;
const defaultSession = {
  id: null,
  signIn: null
};
const defaultResult = {

};

// todo: 만드는중임
async function reqses(req, res, next) {
  if(req.session.user) return null;
  throw null;
}
// todo: 인증된 사용자만 api 사용 가능하게 변경할 것

// 학생 조회
database.get('/', async (req, res) => res.json(await db.users.fetch()));
// 학생 삭제
database.delete('/:sid', async (req, res) => res.json(await db.users.delete(req.params.sid)));
// 학생 수정 ( require('./db').users.modify(sid)
database.put('/:sid', async (req, res) => res.json(await db.users.modify(req.params.sid)));
// 학생 출석 체크 조회
database.get('/:sid', async (req, res)=>res.json(await db.users.student(req.params.sid)));
// 학생 출석체크 INSERT
database.post('/:sid',async (req, res)=>res.json(await db.users.insert(req.params.sid)));
// 새션 조회
auth.get('/', (req, res) => {
  console.log(req.session.user);
  res.json(req.session.user ?? { id: null, signIn: null});
});
// 세션 생성
auth.post('/create', (req, res) => {
  if(req.session?.user) {
    res.json({message: 'session is already.'});
    return;
  }
  const { id, pw } = req.body ?? {};
  if(id === 'ky' && pw === '1234');
  else {
    res.json({message: 'sign in failed.'});
    return;
  }
  req.session.user = {
    id: ++uid,
    signIn: new Date()
  };
  req.session.save();
  res.json({message: 'session created.'});
});
// 세션 삭제
auth.get('/delete', (req, res) => {
  if(req.session?.user) {
    req.session.destroy();
    res.json({message: 'session deleted.'});
  }
  else res.json({message: 'session is empty.'});

});


app.listen(port, ()=>{
    console.log('server opened.');
})
