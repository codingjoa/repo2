const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   철회 가능한 선생 배정 목록
   조건1. 레슨이 생성되지 않음
   조건2. 이번달만
*/

module.exports = async function(
  req, res
) {
  pool.query(`
    select teacherID, (select teacherName from teacher where teacher.teacherID=lessonCharge.teacherID) as teacherName, lessonMonth
    from lessonCharge
    where chargeRetractable=1 and date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') order by teacherID`
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
