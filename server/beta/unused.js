/*
function keyFilter(raw, allowed) {
  const filtered = Object.keys(raw)
  .filter(key =>
    allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
    return obj;
  }, {});
}

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

*/
// NoContent로 보내면 axios 프로미스에서 result가 없어서 후 처리가 안됨.

const { on } = require('events');

module.exports = ((pool, ee) => {
  (async () => {
    for await (const [ value ] of on(ee, 'addTeacher')) {
      const r = await pool.query(
        {
          namedPlaceholders: true,
          sql: 'insert into teacher( teacherName, teacherAccount, teacherPassword, teacherOp ) values ( :teacherName, :teacherAccount, :teacherPassword, :teacherOp )'
        },
        value
      );
      ee.emit('fetch', value);
    }
  })();
  (async () => {
    for await (const [ value ] of on(ee, 'listTeacher')) {
      const r = await pool.query('select teacherID, teacherName, teacherCreated, teacherModified from teacher');
      ee.emit('end', null);
    }
  })();
  (async () => {
    for await (const [ value ] of on(ee, 'delete')) {
      const r = await pool.query('select * from teacher');
      console.log(r);
      ee.emit('end', null);
    }
  })();
  (async () => {
    for await (const [ value ] of on(ee, 'newPassword'))
      console.log(value);
  })();
  (async () => {
    for await (const [ value ] of on(ee, 'test'))
      console.log(value+9);
  })();
});

((pool, ee) => {
  (async () => {
    for await (const [ value ] of on(ee, ''))
      pool.end();
  })();
});
