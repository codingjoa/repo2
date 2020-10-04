const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   이번달 출석부가 발행되지 않은 반 목록
*/

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth;
  const [ teachers, quarters ] = await Promise.all([
    pool.query(`
      select teacherID, teacherName from teacher order by teacherID`
    ),
    pool.query(`
      select quarterID, quarterName from quarter where quarterID not in (select quarterID from lesson where date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')) order by quarterID`,
      [ lessonMonth ]
    )
  ])
  .catch(e => BadRequest(res, e));
  OK(res, {
    teachers, quarters
  });
};
