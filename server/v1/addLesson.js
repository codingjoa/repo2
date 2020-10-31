const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   이번달 레슨을 등록(년월 파라미터 필요 없음)
   이 과정은 철회할 수 없음.
   레슨이 등록되어 수업 배치, 입금을 철회할 수 없음
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const teacherID = req.params?.teacherID;
  await Promise.all([
    pool.query(`
      insert into lesson(quarterID, teacherID, lessonMonth)
      select ? as quarterID, ? as teacherID, concat(date_format(current_date, '%Y-%m'), '-01') as lessonMonth`,
      [ quarterID, teacherID ]
    ),
    pool.query(`
      insert into study(quarterID, lessonMonth, studyWeek)
      select ? as quarterID, concat(date_format(current_date, '%Y-%m'), '-01') as lessonMonth, 1 as studyWeek
      union
      select ? as quarterID, concat(date_format(current_date, '%Y-%m'), '-01') as lessonMonth, 2 as studyWeek
      union
      select ? as quarterID, concat(date_format(current_date, '%Y-%m'), '-01') as lessonMonth, 3 as studyWeek
      union
      select ? as quarterID, concat(date_format(current_date, '%Y-%m'), '-01') as lessonMonth, 4 as studyWeek`,
      [ quarterID, quarterID, quarterID, quarterID ]
    ),
    pool.query(`
      insert into checking(quarterID, lessonMonth, studyWeek, studentID)
      select quarterID, lessonMonth, 1 as studyWeek, studentID from billing where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and billingRetractable=1
      union
      select quarterID, lessonMonth, 2 as studyWeek, studentID from billing where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and billingRetractable=1
      union
      select quarterID, lessonMonth, 3 as studyWeek, studentID from billing where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and billingRetractable=1
      union
      select quarterID, lessonMonth, 4 as studyWeek, studentID from billing where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and billingRetractable=1`,
      [ quarterID, quarterID, quarterID, quarterID ]
    )
  ])
  .catch(e => BadRequest(res, e))
  pool.query(`
    update billing set billingRetractable=0 where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and billingRetractable=1`,
    [ quarterID ]
  )
  .then(r => OK(res))
  .catch(e => BadRequest(res, e))
};
