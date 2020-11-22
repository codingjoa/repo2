const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  pool.query(`
select
  studentID.*
from
  studentID,
  billing,
  lesson
where
  studentID.studentID=billing.studentID and
  billing.lessonMonth=lesson.lessonMonth and
  billing.quarterID=lesson.quarterID and
  lesson.quarterID=? and
  date_format(lesson.lessonMonth, '%Y-%m')=date_format(?, '%Y-%m')`,
    [ quarterID, lessonMonth ]
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
