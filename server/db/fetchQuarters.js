const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   전체 반 목록을 조회합니다.
*/

module.exports = async function(
  req, res
) {
  pool.query(
    'select * from quarter'
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
