const mariadb = require('mariadb');
const { EventEmitter } = require('events');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'ky',
  database: 'ky', // this.user??
  password: '1234',
  connectionLimit: 5
});

const student = require('./db/student')(pool);
const teacher = require('./db/teacher')(pool);
const quarter = require('./db/quarter')(pool);
const study = require('./db/study')(pool);
const permission = require('./db/permission')(pool);
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
async function end() {
  pool.end();
}

module.exports = { student, teacher, quarter, study, permission, end, utils };

/* @codingjoa
   테스트 코드
curl -X PUT -H 'Content-Type: application/json' -d '{"qid":"6", "qname":"엘리트1반"}' http://localhost:3307/api/test

curl -X POST -H 'Content-Type: application/json' -d '{"sdate":"6", "ctime":"2020-08-30"}' http://localhost:3307/api/test/check
curl -X POST -H 'Content-Type: application/json' -d '{"tid":"5" }' http://localhost:3307/api/test/reset
curl -X POST -H 'Content-Type: application/json' -d '{"tid":"1213" }' http://localhost:3307/api/test/reset

curl -X POST -H 'Content-Type: application/json' -d '{"id":"ky" "pw":"1234"}' http://localhost:3307/api/test/login
curl -X POST -H 'Content-Type: application/json' -d '{"id":"ky" "pw":"6ef777"}' http://localhost:3307/api/test/login



*/
