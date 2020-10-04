const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   선생을 반에 배정
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  const teacherID = req.params?.teacherID;
  pool.query(`
    insert into lessonCharge values(
    ?,
    ?,
    concat(date_format(?, '%Y-%m'), '-01'),
    1
    )`,
    [ teacherID, quarterID, lessonMonth ]
  )
  .then(r => OK(res))
  .catch(e => BadRequest(res, e));
};
