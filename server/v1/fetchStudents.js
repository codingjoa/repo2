const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

module.exports = async function(
  req, res
) {
  const quarterID = req.params.quarterID;
  pool.query(`
select
  studentInfo.*,
  studentID.studentCreated,
  (select case when count(*)>0 then 0 else 1 end as isCanBeClosed
  from lesson right join billing
  on lesson.quarterID=billing.quarterID and
    lesson.lessonMonth=billing.lessonMonth
  where
    billing.studentID=studentID.studentID and
    (lesson.lessonEnded=0 or
    billing.billingRetractable=1)
  ) as isCanBeClosed
from
  studentID,
  studentInfo
where
  studentID.studentID=studentInfo.studentID and
  unused=0`
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
