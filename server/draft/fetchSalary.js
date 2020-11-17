const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   최저시급 등 계산에 영향을 미치는 요소들
*/

module.exports = async function(
  req, res
) {
  pool.query(`
  select * from salary`)
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
