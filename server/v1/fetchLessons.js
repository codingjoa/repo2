const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   담당하는 작업 가눙한 출석부 목록 조회
*/

module.exports = async function(
  req, res
) {
  const teacherID = req.session?.tid;
  pool.query(`
select
  quarterID,
  (select quarterName
  from quarter
  where quarter.quarterID=lesson.quarterID
  ) as quarterName,
  lessonMonth
from lesson
where
  lessonEnded=0 and
  lesson.teacherID=?`,
    [ teacherID ]
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
