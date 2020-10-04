const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   마감 처리해야하는 출석부와
   진행중인 출석부 조회
*/

module.exports = async function(
  req, res
) {
  const [ canbeClosedLesson, lesson ] = await Promise.all([
    pool.query(`
      select quarterID, (select quarterName from quarter where quarter.quarterID=lesson.quarterID) as quarterName, lessonMonth from lesson where date_format(current_date, '%Y-%m')<>date_format(lessonMonth, '%Y-%m') and lessonEnded=0 order by quarterID`
    ),
    pool.query(`
      select quarterID, (select quarterName from quarter where quarter.quarterID=lesson.quarterID) as quarterName, lessonMonth from lesson where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and lessonEnded=0 order by quarterID`
    )
  ])
  .catch(e => BadRequest(res, e));
  OK(res, {
    canbeClosedLesson, lesson
  });
};
