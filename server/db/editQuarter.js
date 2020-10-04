const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   반 이름 변경
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const quarterName = req.body?.quarterName;
  pool.query(
    'update quarter set quarterName=? where quarterID=?',
    [ quarterName ?? null, quarterID ?? null ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
