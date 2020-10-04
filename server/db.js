
const fetch = require('./db/fetch')(pool);
const create = require('./db/create')(pool);
const modify = require('./db/modify')(pool);
const remove = require('./db/delete')(pool);
const password = require('./db/password')(pool);
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

module.exports = {
  fetch,
  create,
  modify,
  remove,
  password,
  permission,
  utils,
  end
};
