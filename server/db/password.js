const bcrypt = require('bcrypt');
const cryptoRandomString = require('crypto-random-string');
const { OK, Created, BadRequest } = require('../format.js');

module.exports = function fetch(pool) { return {
  async certification(req, res, next) {
/* @codingjoa
   아이디와 비밀번호가 일치하는지 검사
   400 BadRequest
*/
    const teacherAccount = req.session?.user?.id ?? req.body?.id;
    const { pw: teacherPassword } = req.body ?? {};
    pool.query(
      'select teacherID, teacherPassword, teacherOp from teacher where teacherAccount=?',
      [ teacherAccount ]
    )
    .then(async r => {
      if(r.length === 0 && BadRequest(res, new Error('존재하지 않는 아이디입니다.'))) return;
      const newPassword = r[0].teacherPassword;
      if(! await bcrypt.compare(teacherPassword, newPassword) && BadRequest(res, new Error('비밀번호가 일치하지 않습니다'))) return;
      if(req.session?.user === undefined) {
        req.session.user = {
          tid: r[0].teacherID,
          id: teacherAccount,
          op: r[0].teacherOp
        };
      }
      next();
    })
    .catch(e => BadRequest(res, e));
  },
  async regeneratePassword(req, res, next) {
/* @codingjoa
   비밀번호를 재설정
   201 Created
   400 BadRequest
*/
    const teacherID = req.params.tid ?? req.next.tid;
    const saltRounds = 10;
    const tempPW = cryptoRandomString({ length: 6 });
    const teacherPassword = await bcrypt.hash(tempPW, saltRounds);
    pool.query(
      'update teacher set teacherPassword=? where teacherID=?',
      [ teacherPassword, teacherID ]
    )
    .then(r => {
      !r.affectedRows && BadRequest(res, new Error('존재하지 않는 ID입니다.'));
      r.affectedRows && Created(res, { password: tempPW }) && next();
    })
    .catch(e => BadRequest(res, e));
  },
  async changeMyPassword(req, res, next) {
/* @codingjoa
   자신의 비밀번호를 변경
   201 Created
   400 BadRequest
*/
    const { newpw: tempPW } = req.body;
    const { tid: teacherID } = req.session?.user ?? {};
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
  },
  async updateTimeForPasswordChange(req, res) {
/* @codingjoa
   비밀번호 변경 시간을 현재시간으로 변경
   teacher 첫 생성시에는 실행하지 않음.
*/
    const teacherID = req.session?.user?.tid ?? req.params.tid ?? null;
    if(tid === null) return;
    pool.query(
      'update teacher set teacherPassword=current_timestamp where teacherID=?',
      [ teacherID ]
    )
    .catch(e => 0);
  }
}}
