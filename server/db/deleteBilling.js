const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   학생 수강 등록을 철회
*/

module.exports = async function(
  req, res
) {
  const studentID = req.params?.studentID;
  const lessonMonth = req.params?.lessonMonth;
  pool.query(`
    delete from billing where studentID=? and lessonMonth=? limit 1`,
    [ studentID ?? null, lessonMonth ?? null ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('삭제되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
