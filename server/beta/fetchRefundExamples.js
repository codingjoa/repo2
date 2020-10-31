const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   환불 사유 예시
*/

module.exports = async function(
  req, res
) {
  pool.query(`
  select * from refundExample`)
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
