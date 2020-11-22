const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

module.exports = async function(
  req, res
) {
  const weekNum = req.params?.weekNum;
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  pool.query(`
select
  checking.*,
  (select
    studentName
  from
    studentInfo
  where
    checking.studentID=studentInfo.studentID
  ) as studentName,
  (select
    studentBirthday
  from
    studentInfo
  where
    checking.studentID=studentInfo.studentID
  ) as studentBirthday
from
  checking
where
  date_format(lessonMonth, '%Y-%m')=date_format(?, '%Y-%m') and quarterID=? and studyWeek=?`,
    [ lessonMonth, quarterID, weekNum-0 ]
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
