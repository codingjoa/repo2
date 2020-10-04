const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   해당 레슨 하위 정보 조회
*/

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth;
  const quarterID = req.params?.quarterID;
  pool.query(`
    select
    (select quarterName from quarter where quarter.quarterID=lessonCharge.quarterID) as quarterName,
    (select teacherName from teacher where teacher.teacherID=lessonCharge.teacherID) as teacherName
    from lesson, lessonCharge where
    lesson.quarterID=lessonCharge.quarterID and
    lesson.lessonMonth=lessonCharge.lessonMonth and
    date_format(?, '%Y-%m')=date_format(lesson.lessonMonth, '%Y-%m') and
    lesson.quarterID=?`,
    [ lessonMonth, quarterID ]
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
