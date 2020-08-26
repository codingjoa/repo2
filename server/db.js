const mariadb = require('mariadb');
const host = 'localhost';
const user = 'ky';
const database = user;
const password = '1234';
const pool = mariadb.createPool({host, user, password, database, connectionLimit: 5});

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
  async mod(sid) {
    const values = [];
    return await pool.query('update student_check set qid=(?), name=(?), age=(?), birthday=(?), gender=(?), phone=(?), email=(?), address=(?), uniqueness=(?) where sid=(?)', values);
  },
  async fetch(sid) {
    let promise;
    if(sid) promise = pool.query('select * from student where sid=(?)', [ sid ]);
    else promise = pool.query('select * from student where isDeleted=0');
    return await promise;
  }
};

async function all() {
  const list = await pool.query('show tables');
  const proms = list.map(n => pool.query(`desc ${n.Tables_in_ky}`));
  const names = list.map(r => r.Tables_in_ky);
  let res = await Promise.all(proms);

  return [ res.map(r => r.map(s => s.Field)), names ];
}

const plak = {
  async list() {
    return await pool.query('select sid, q.qid, name, email, tid, classes from quarter_imformation q left join student s on q.qid = s.qid');
  }
};

async function end() {
  pool.end();
}

if(process.argv[2] === 'd') {
  plak.list().then(console.log, console.error).then(end, end);
}

//checkUser promise right..?
async function checkUser(cl, name){
  const values = [cl, name];
  return await pool.query('insert into student_check(class, name) select class, name from student where ??')
  //.then(console.log, console.error);
}



module.exports = { users, end};
