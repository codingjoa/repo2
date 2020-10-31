const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   반 이름 변경
*/

module.exports = async function(
  req, res
) {
  const editID = req.params?.editID;
  const refundReason = req.body?.refundReason;
  pool.query(
    'update refundExample set refundReason=? where editID=?',
    [ refundReason ?? null, editID ?? null ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
