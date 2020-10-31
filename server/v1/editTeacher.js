const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   반 정보를 삭제
*/

module.exports = async function(
  req, res
) {
  const teacherID = req.params?.teacherID;
  const teacherName = req.body?.teacherName;
  pool.query(
    'update teacher set teacherName=? where teacherID=? limit 1',
    [ teacherName ?? null, teacherID ?? null ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
