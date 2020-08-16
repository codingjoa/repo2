const mariadb = require('mariadb');
const host = 'localhost';
const user = 'ky';
const database = user;
const password = '1234';
const pool = mariadb.createPool({host, user, password, database, connectionLimit: 5});

//test().then(end, end);

async function test() {
  // id가 1인 학생 검색
  //await fetchUser(1);
  // 아조씨라는 학생 추가
  //await addUser('b', '아조씨', '남', '01012345678', 'taes@gmail.com', '경기도 성남시 중원구 희망로');
  // 모든 학생 검색
  await fetchUser();
}

async function fetchUser(id) {
  let promise;
  if(id) promise = pool.query('select * from student where id=(?)', [ id ]);
  else promise = pool.query('select * from student');
  return await promise;
}

async function addUser(cl, name, gender, phone, email, address) {
  const values = [ cl, name, gender, phone, email, address ];
  return await pool.query('insert into student (class, name, gender, phone, email, address) values ( (?), (?), (?), (?), (?), (?) )', values)
  //.then(console.log, console.error);
}
//checkUser promise right..?
async function checkUser(cl, name){
  const values = [cl, name];
  return await pool.query('insert into student_check(class, name) select class, name from student where ??')
  //.then(console.log, console.error);
}

async function end() {
  pool.end();
}

module.exports = { fetchUser, end };
