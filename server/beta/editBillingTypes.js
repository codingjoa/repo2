const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   요금표 변경
*/

module.exports = async function(
  req, res
) {
  const billingPrice = req.body?.billingPrice;
  const billingPayment = req.body?.billingPayment;
  const billingGroup = req.body?.billingGroup;
  pool.query(`
    update billingTypes set billingPrice=?
    where
    billingPayment=? and
    billingGroup=?`,
    [ billingPrice ?? null, billingPayment ?? null, billingGroup ?? null ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
