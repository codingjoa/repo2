const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   학생을 반에 수강 등록
*/

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth;
  const reqIter = req.body?.reqIter;
  if(!reqIter) {
    BadRequest(res, new Error('잘못된 요청을 보냈습니다.'));
    return;
  }
  const promise = reqIter.map(({ studentID, quarterID, billingPayment, billingGroup, billingPrice }) => 
  pool.query(`
    insert into billing values(
    ?,
    ?,
    concat(date_format(?, '%Y-%m'), '-01'),
    ?,
    ?,
    ?,
    1
    )`,
    [ studentID, quarterID, lessonMonth, billingPayment, billingGroup, billingPrice ]
  ));
  Promise.all(promise)
  .then(r => OK(res))
  .catch(e => BadRequest(res, e));
};



/*
    insert into billing values(
    ?,
    ?,
    concat(date_format(?, '%Y-%m'), '-01'),
    ?,
    ?,
    (select billingPrice from billingTypes where billingPayment=? and billingGroup=?),
    1
    )`,

*/
