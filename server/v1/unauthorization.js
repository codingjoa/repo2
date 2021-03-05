const { OK } = require('../format');
const { pool } = require('../poolManager');


/* @codingjoa
   세션 삭제 a.k.a 로그아웃
*/
module.exports = async function(
  req, res
) {
  req.session.destroy();
  OK(res);
}
