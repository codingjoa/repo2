const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   사용하지 않는 학생으로 변경
*/

module.exports = async function(
  req, res
) {
  const studentID = req.params?.studentID;
  pool.query(`
    update studentID set unused=1 where studentID=? limit 1`,
    [ studentID ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
