const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   반을 폐쇄 가능한지
   조건1. 실존하는 학생
   조건2. 실존하는 학생 중 사용중인 학생
   조건3. 이 student가 사용된 lesson이 lessonEnded이거나 없어야 함
*/

module.exports = async function(
  req, res, next
) {
  const studentID = req.params?.studentID;
  pool.query(`
select
  0 as when1,
  0 as when2,
  0 as when3
union
select
  1 as when1,
  case when unused=0 then 1 else 0 end as when2,
  (select
    case when count(*)>0 then 0 else 1 end
  from
    lesson, billing
  where
    lesson.quarterID=billing.quarterID and
    lesson.lessonMonth=billing.lessonMonth and
    billing.studentID=studentID.studentID and
    lesson.lessonEnded=0
  ) as when3
from
  studentID
where
  studentID=?
order by
  when1
  desc
limit 1`,
    [ studentID, studentID ]
  )
  .then(r => {
    const { when1, when2, when3 } = r[0];
    when1 && when2 && when3 ? next() : Forbidden(res);
  })
  .catch(e => BadRequest(res, e));
};
