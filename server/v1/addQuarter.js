const { Created, BadRequest} = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   반 생성
*/

module.exports = async function(
  req, res
) {
  pool.query(
    'insert into quarter() values ()'
  )
  .then(r => r.insertId ? Created(res, { quarterID: r.insertId }) : BadRequest(res, new Error('정보가 생성되지 읺았습니다.')))
  .catch(e => BadRequest(res, e));
};
