const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   반을 폐쇄 가능한지
   조건1. 실존하는 반
   조건2. 실존하는 반이며 사용중인 반
   조건3. 이 quarter가 사용된 lesson이 lessonEnded이거나 없어야 함
   조건4. 이 quarter가 사용된 billing이 Retractable이 모두 0이거나 없어야 함
*/

module.exports = async function(
  req, res, next
) {
  const quarterID = req.params?.quarterID;
  pool.query(`
select
  0 as when1,
  0 as when2,
  0 as when3,
  0 as when4
union
select
  1 as when1,
  case when unused=0 then 1 else 0 end as when2,
  (select case when count(*)>0 then 0 else 1 end as permission
  from lesson
  where lessonEnded=0 and
    quarter.quarterID=lesson.quarterID
  ) as when3,
  (select case when count(*)>0 then 0 else 1 end as permission
  from billing
  where billingRetractable=1 and
    quarter.quarterID=billing.quarterID
  ) as when4
from
  quarter
where
  quarterID=?
order by
  when1
  desc
limit 1`,
    [ quarterID ]
  )
  .then(r => {
    const { when1, when2, when3, when4 } = r[0];
    when1 && when2 && when3 && when4 ? next() : Forbidden(res);
  })
  .catch(e => BadRequest(res, e));
};
