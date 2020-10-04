const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   선생님 정보를 삭제
*/

module.exports = async function(
  req, res
) {
  const teacherID = req.params?.teacherID;
  pool.query(
    'delete from teacher where teacherID=? limit 1',
    [ teacherID ?? null ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('삭제되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
