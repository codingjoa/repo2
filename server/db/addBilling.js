const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   학생을 반에 수강 등록
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  const studentID = req.params?.studentID;
  const billingPayment = req.body?.billingPayment
  const billingGroup = req.body?.billingGroup
  pool.query(`
    insert into billing values(
    ?,
    ?,
    concat(date_format(?, '%Y-%m'), '-01'),
    ?,
    ?,
    (select billingPrice from billingTypes where billingPayment=? and billingGroup=?),
    1
    )`,
    [ studentID, quarterID, lessonMonth, billingPayment, billingGroup, billingPayment, billingGroup ]
  )
  .then(r => OK(res))
  .catch(e => BadRequest(res, e));
};
