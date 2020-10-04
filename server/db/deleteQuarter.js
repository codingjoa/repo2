const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   반 정보를 삭제
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  pool.query(
    'delete from quarter where quarterID=?',
    [ quarterID ?? null ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('삭제되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
