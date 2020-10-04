const { BadRequest, Created } = require('../format');
const { pool } = require('../poolManager');
const bcrypt = require('bcrypt');

/* @codingjoa
   자신의 비밀번호를 변경
   201 Created
   400 BadRequest
*/

module.exports = async function(
  req, res, next
) {
  const tempPW = req.body?.newpw;
  const teacherID = req.session?.user?teacherID;
  const saltRounds = 10;
  const teacherPassword = await bcrypt.hash(tempPW, saltRounds);
  pool.query(
    'update teacher set teacherPassword=? where teacherID=?',
    [ teacherPassword, teacherID ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('존재하지 않는 ID입니다.'));
    r.affectedRows && Created(res) && next();
  })
  .catch(e => BadRequest(res, e));
};
