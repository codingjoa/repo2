const { BadRequest, Created } = require('../format');
const { pool } = require('../poolManager');
const bcrypt = require('bcrypt');
const cryptoRandomString = require('crypto-random-string');

/* @codingjoa
   비밀번호를 재설정
   201 Created
   400 BadRequest
*/

module.exports = async function(
  req, res, next
) {
  const teacherID = req.params.teacherID ?? req.next.teacherID;
  const saltRounds = 10;
  const tempPW = cryptoRandomString({ length: 6 });
  const teacherPassword = await bcrypt.hash(tempPW, saltRounds);
  pool.query(
    'update teacher set teacherPassword=? where teacherID=? limit 1',
    [ teacherPassword, teacherID ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('존재하지 않는 ID입니다.'));
    r.affectedRows && Created(res, { password: tempPW }) && next();
  })
  .catch(e => BadRequest(res, e));
};
