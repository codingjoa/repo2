const { BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   반 정보를 삭제
*/

module.exports = async function(
  req, res, next
) {
/* @codingjoa
   POST
   선생님 정보를 새로 생성
   임시 비밀번호는 regeneratePassword로 넘김
   400 BadRequest
*/
  const teacherName = req.body?.teacherName;
  const teacherAccount = req.body?.id;
  pool.query(
    'insert into teacher(teacherName, teacherAccount, teacherPassword) values(?, ?, 0)',
    [ teacherName, teacherAccount ]
  )
  .then(r => ( ( req.next.teacherID = r.insertId ) > 0 ) ? next() : BadRequest(res, new Error('정보가 생성되지 않았습니다.')))
  .catch(e => BadRequest(res, e));
};