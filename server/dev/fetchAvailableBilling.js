const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   수강 등록이 가능한 학생 목록+반
*/

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth;
  const [ students, quarters ] = await Promise.all([
    pool.query(`
      select studentID, (select studentName
      from studentInfo
      where studentID.studentID=studentInfo.studentID and
      unused=0) as studentName
      from studentID
      where studentID not in (select studentID from billing where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m')) order by studentID`
    ),
    pool.query(`
      select quarterID, quarterName from quarter where unused=0 and quarterID not in (select quarterID from lesson where date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')) order by quarterID`,
      [ lessonMonth ]
    )
  ])
  .catch(e => BadRequest(res, e));
  OK(res, {
    students, quarters
  });
};
