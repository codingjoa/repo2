const mariadb = require('mariadb');
const { EventEmitter } = require('events');

const host = 'localhost';
const user = 'ky';
const database = user;
const password = '1234';
const pool = mariadb.createPool({host, user, password, database, connectionLimit: 5});
/*
const ee = new EventEmitter();
require('./db/teacher')(pool, ee);

let teacherName = '설민석',
teacherAccount = 'history',
teacherPassword = '12345',
teacherOp = 0;
ee.emit('add', { teacherName, teacherAccount, teacherPassword, teacherOp });
*/




const quarter = {
  async create(req, res) {
/* @codingjoa
   반을 생성하는 함수: post
   tid: 담당하게 될 선생 id
*/
    const { tid: teacherID } = req.body;
    console.log(req.body);
    const grace = await pool.query({
      namedPlaceholders: true,
      sql: 'insert into quarter(teacherID) values (:teacherID)'
    },{ teacherID })
    .then(r => ({complete: true, message: '반 생성에 성공했습니다.' }))
    .catch(e => ({ complete: false, message: '반 생성에 실패했습니다.' }));
    res.json(grace);
  },
  async rename(req, res) {
    const { qid: quarterID, qname: quarterName } = req.body;
    const grace = await pool.query({
      namedPlaceholders: true,
      sql: 'update quarter set quarterName=:quarterName where quarterID=:quarterID'
    },{ quarterID, quarterName })
    .then(r => ({ complete: true, message: '반 이름 변경에 성공했습니다.' }))
    .catch(e => ({ complete: false, message: '반 이름 변경에 실패했습니다.' }));
    res.json(grace);
  },
  async fetch(req, res) {
    const grace = await pool.query('select * from quarter')
    .then(r => ({ complete: true, data: r }))
    .catch(e => ({ complete: false, message: '조회에 실패했습니다.' }));
    res.json(grace);
  }
}




// 학생 정보를 다루는 클래스
const users = {
  async add(qid, name, age, birthday, gender, phone, email, address, uniqueness) {
    const values = [qid, name, age, birthday, gender, phone, email, address, uniqueness ];
    return await pool.query('insert into student values (null, (?), (?), (?), (?), (?), (?), (?), (?), (?) now(), 0)', values);
  },
  async del(sid) {
    return await pool.query('UPDATE student SET isDeleted = 1 WHERE sid = (?)', [sid]);
  },
  //어디서 받아와야하는건데 ..? express에서 하는방법..? api/customer 이런 곳에서 받아와야 하는거 아닌가요..?
  //궁금해서 일단 쿼리분은 적어봤는데.. 그 받아오는걸 모르겠어요..
  async modify(sid) {
    const values = [];
    return await pool.query('update student set qid=(?), name=(?), age=(?), birthday=(?), gender=(?), phone=(?), email=(?), address=(?), uniqueness=(?) where sid=(?)', values);
  },
  async fetch(sid) {
    let promise;
    if(sid) promise = pool.query('select * from student where sid=(?)', [ sid ]);
    else promise = pool.query('select * from student where isDeleted=0');
    return await promise;
  }
};

//학생 체크 구문
const check = {
  async insert(sid){
    return await pool.query('insert into student_check (sid, qid, name, isDeleted) select sid, qid, name, isDeleted from student where sid = (?)', [sid]);
  },
  async student(sid){
    let promise;
    if(sid) promise = pool.query('select * from student_check where sid=(?)', [ sid ]);
    else promise = pool.query('select * from student_check where isDeleted=0');
    return await promise;
  }
};

const utils = {
  async getTableNames() {
    // ky database의 모든 테이블을 수집
    const list = await pool.query('show tables');
    // desc 테이블 정보를 요청하는 promise의 배열을 proms에 저장
    const proms = list.map(n => pool.query(`desc ${n.Tables_in_ky}`));
    // 테이블 이름만 배열로 저장
    const names = list.map(r => r.Tables_in_ky);
    // promise가 모두 끝날때까지 대기하고 완료되면 결과를 배열로 저장
    let res = await Promise.all(proms);
    // 그 결과 중에서 Field라는 결과만 가져옴 [ Field(필드이름들) 배열, 테이블이름들 배열]
    return [ res.map(r => r.map(s => s.Field)), names ];
  }
};

const plak = {
  async list() {
    // student랑 quarter_information만 합친 결과
    return await pool.query('select sid, q.qid, name, email, tid, classes from quarter_imformation q left join student s on q.qid = s.qid');
  }
};

async function end() {
  pool.end();
}


module.exports = { users, check, utils, plak, end, quarter };
