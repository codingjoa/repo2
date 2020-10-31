const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   분류별 금액
*/

module.exports = async function(
  req, res
) {
  pool.query(`
select * from billingTypes where
billingGroup < 3 and billingPayment < 2`
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
