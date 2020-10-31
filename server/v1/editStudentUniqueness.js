const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   학생 특이사항 정보를 수정
*/

module.exports = async function(
  req, res
) {
  const studentID = req.params?.studentID;
  const studentUniqueness = req.body?.studentUniqueness;
  pool.query(
    'update studentInfo set studentUniqueness=? where studentID=?',
    [ studentUniqueness ?? null,
      studentID ?? null ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
