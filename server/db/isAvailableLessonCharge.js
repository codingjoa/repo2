const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   수강 등록 가능 여부 확인
   조건1. 실존하는 선생임
   조건2. 반에 선생이 배치되지 않음
   조건3. 실존하는 반임
*/

module.exports = async function(
  req, res, next
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  const teacherID = req.params?.teacherID;
  pool.query(`
    select
    (select case when count(*)>0 then 1 else 0 end as permission from teacher where teacherID=?) as when1,
    (select case when count(*)>0 then 0 else 1 end as permission from lessonCharge where
    quarterID=? and lessonMonth=?) as when2,
    (select case when count(*)>0 then 1 else 0 end as permission from quarter where quarterID=?) as when3`,
    [ teacherID, quarterID, lessonMonth, quarterID ]
  )
  .then(r => {
    const { when1, when2, when3 } = r[0];
    when1 && when2 && when3 ? next() : Forbidden(res);
  })
  .catch(e => BadRequest(res, e));
};
