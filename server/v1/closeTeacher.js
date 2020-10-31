const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   사용하지 않는 선생으로 변경
*/

module.exports = async function(
  req, res
) {
  const teacherID = req.params?.teacherID;
  pool.query(`
    update teacher set unused=1 where teacherID=? limit 1`,
    [ teacherID ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
