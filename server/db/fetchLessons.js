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
    select lesson.quarterID, lesson.lessonMonth from lesson, lessonCharge where
    lesson.quarterID=lessonCharge.quarterID and
    lesson.lessonMonth=lessonCharge.lessonMonth and
    lesson.lessonEnded=0 and
    lessonCharge.teacherID=?`,
    [ teacherID ]
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
