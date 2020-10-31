const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   사용하지 않는 반으로 변경
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  pool.query(`
    update quarter set unused=1 where quarterID=? limit 1`,
    [ quarterID ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
