const { pool } = require('../poolManager');
const bcrypt = require('bcrypt');

/* @codingjoa
   비밀번호 변경 시간을 현재시간으로 변경
   teacher 첫 생성시에는 실행하지 않음.
*/

module.exports = async function(
  req, res
) {
  const teacherID = req.session?.tid ?? req.params?.tid ?? null;
  if(teacherID === null) return;
  pool.query(
    'update teacher set teacherModifiedPassword=current_timestamp where teacherID=?',
    [ teacherID ]
  )
  .catch(e => 0);
};
