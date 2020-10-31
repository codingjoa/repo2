const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   선생을 미사용 선생으로 변경 가능한지
   조건1. 관리자가 아니어야 함
   조건2. 이 teacher가 사용된 lesson이 lessonEnded이거나 없어야 함
   조건3. 실존 선생이어야 함
   조건4. 실존 선생이고 이미 미사용이 아니어야 함
*/

module.exports = async function(
  req, res, next
) {
  const teacherID = req.params?.teacherID;
  pool.query(`
select
  0 as when1,
  0 as when2,
  0 as when3,
  0 as when4
union
select
  case when teacherOp=0 then 1 else 0 end as when1,
  (select
    case when count(*)>0 then 0 else 1 end
  from
    lesson
  where
    lesson.teacherID=teacher.teacherID and
    lesson.lessonEnded=0
  ) as when2,
  1 as when3,
  case when unused=0 then 1 else 0 end as when4
from
  teacher
where
  teacherID=?
order by
  when3
  desc
limit 1`,
    [ teacherID ]
  )
  .then(r => {
    const { when1, when2, when3, when4 } = r[0];
    when1 && when2 && when3 && when4 ? next() : Forbidden(res);
  })
  .catch(e => BadRequest(res, e));
};
