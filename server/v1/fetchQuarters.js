const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   전체 반 목록을 조회합니다.
*/

module.exports = async function(
  req, res
) {
  pool.query(`
select
  quarter.*, 
  (select case when count(*)>0 then 0 else 1 end as isCanBeClosed
  from lesson
  where
    lessonEnded=0 and
    lesson.quarterID=quarter.quarterID
  union
  select case when count(*)>0 then 0 else 1 end as isCanBeClosed
  from billing
  where
    billingRetractable=1 and
    billing.quarterID=quarter.quarterID
  order by isCanBeClosed asc
  limit 1
  ) as isCanBeClosed
from quarter
where unused=0`
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
