const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   수강 등록 철회 가능 여부
   조건1. 레슨이 생성되지 않음
*/

module.exports = async function(
  req, res, next
) {
  const studentID = req.params?.studentID;
  const lessonMonth = req.params?.lessonMonth;
  pool.query(`
    select case when max(billingRetractable)=1 then 1 else 0 end as permission
    from billing
    where studentID=? and date_format(lessonMonth, '%Y-%m')=date_format(?, '%Y-%m')`,
    [ studentID ?? null, lessonMonth ?? null ]
  )
  .then(r => {
    r[0].permission ? next() : Forbidden(res);
  })
  .catch(e => BadRequest(res, e));
};
