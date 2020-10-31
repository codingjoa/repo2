const { Created, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   학생의 환불/이월 사유를 등록
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID ?? 0
  const lessonMonth = req.params?.lessonMonth ?? 0;
  const refunds = req.body?.refunds ?? null;
  function params(...params) {
    return params;
  }
  const promises = [];
  let i = 0;
  for(const { studentID, refundReason, refundPercent } of refunds) {
  
  promises[i++] = pool.query(`
insert into refund select
  studentID,
  quarterID,
  lessonMonth,
  ? as refundReason,
  ? as refundPercent
from
  billing
where
  ?=studentID and
  ?=quarterID and
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and
  0=billingRetractable`,
    params(refundReason, refundPercent, studentID, quarterID, lessonMonth)
  )
  }
  Promise.all(promises)
  .then(r => Created(res, {
    total: refunds.length,
    success: r.length
  }))
  .catch(e => BadRequest(res, e));
};
