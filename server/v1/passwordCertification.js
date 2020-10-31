const { BadRequest } = require('../format');
const { pool } = require('../poolManager');
const { setInfo, getInfo } = require('../sessionMapManager');
const bcrypt = require('bcrypt');

/* @codingjoa
   아이디와 비밀번호가 일치하는지 검사
   400 BadRequest
*/

module.exports = async function(
  req, res, next
) {
  const teacherAccount = req.body?.id ?? getInfo(req.session?.tid).id;
  const teacherPassword = req.body?.password;
  pool.query(
    'select teacherID, teacherPassword, teacherOp, teacherName from teacher where teacherAccount=? and unused=0 limit 1',
    [ teacherAccount ]
  )
  .then(async r => {
    if(r.length === 0 && BadRequest(res, new Error('존재하지 않는 아이디입니다.'))) return;
    const newPassword = r[0].teacherPassword;
    if(! await bcrypt.compare(teacherPassword, newPassword) && BadRequest(res, new Error('비밀번호가 일치하지 않습니다'))) return;
    if(req.session.tid === undefined) {
      const tid = r[0].teacherID;
      setInfo(tid, { id: teacherAccount, op: r[0].teacherOp, name: r[0].teacherName });
      req.session.tid = tid;
    }
    next();
  })
  .catch(e => BadRequest(res, e));
};
