const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   생성된 수강 등록 조회
   조건1. 요청한 달만
*/

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth;
  pool.query(`
    select
      studentID,
      (select studentName from studentInfo where billing.studentID=studentInfo.studentID) as studentName,
      lessonMonth,
      (select quarterName from quarter where billing.quarterID=quarter.quarterID) as quarterName,
      billingPayment,
      billingGroup,
      billingPrice,
      billingRetractable
    from billing
    where date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m') order by studentID asc, billingRetractable desc`,
    [ lessonMonth ?? null ]
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
