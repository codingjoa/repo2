const bcrypt = require('bcrypt');
const cryptoRandomString = require('crypto-random-string');

module.exports = function teacher(pool) {
  return {

  async certification(req, res, next) {
/* @codingjoa
   아이디와 비밀번호가 일치하는지 검사
*/
    const { id: teacherAccount, pw: teacherPassword } = req.body ?? {};
    const grace = await pool.query(
      'select teacherID, teacherPassword from teacher where teacherAccount=?',
      [ teacherAccount ]
    )
    if(grace.length === 0) {
      res.json({ complete: false, message: '존재하지 않는 아이디입니다.' });
      return;
    }
    if(await bcrypt.compare(teacherPassword, grace[0].teacherPassword)) {
      if(req.session?.user === undefined) {
        req.session.user = {
          tid: grace[0].teacherID,
          id: teacherAccount
        };
      }
      next();
    }
    else res.json({ complete: false, message: '로그인에 실패했습니다.'});
  },
  async create() {
/* @codingjoa
   선생님 정보를 새로 생성
*/

  },
  async regeneratePassword(req, res) {
/* @codingjoa
   비밀번호를 재설정
*/
    const { tid: teacherID } = req.generate ?? req.body ?? {};
    const saltRounds = 10;
    const tempPW = cryptoRandomString({ length: 6 });
    const teacherPassword = await bcrypt.hash(tempPW, saltRounds);
    const grace = await pool.query(
      'update teacher set teacherPassword=? where teacherID=?',
      [ teacherPassword, teacherID ]
    )
    .then(r => {
      if(r.affectedRows > 0) return { complete: true, message: `비밀번호 초기화에 성공. 임시 비밀번호는 ${tempPW}입니다.` };
      else return { complete: false, message: '존재하지 않는 ID입니다.' };
    })
    .catch(e => ({ complete: false, message: `db 오류: ${e.message}` }));
    res.json(grace);
  }

  };

};
/*
{ id,  }
1002,
  '임시명',
  'temp',
  '1234',
  1
);
*/
