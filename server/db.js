const mariadb = require('mariadb');
const host = 'localhost';
const user = 'ky';
const database = user;
const password = '1234';
const pool = mariadb.createPool({host, user, password, database, connectionLimit: 5});

const users = {
  async add(cl, name, gender, phone, email, address) {
    const values = [ cl, name, gender, phone, email, address ];
    return await pool.query('insert into student (class, name, gender, phone, email, address) values ( (?), (?), (?), (?), (?), (?) )', values);
  },
  async del() {
    return await pool.query('UPDATE student SET isDeleted = 1 WHERE id = ?', [ id ]);
  },
  async mod() {},
  async fetch(id) {
    let promise;
    if(id) promise = pool.query('select * from student where id=(?)', [ id ]);
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
