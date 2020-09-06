const bcrypt = require('bcrypt');
const cryptoRandomString = require('crypto-random-string');

module.exports = function teacher(pool) {
  return {

  async certification(req, res, next) {
/* @codingjoa
   아이디와 비밀번호가 일치하는지 검사
*/
    const teacherAccount = req.session?.user?.id ?? req.body?.id;
    const { pw: teacherPassword } = req.body ?? {};
    const grace = pool.query(
      'select teacherID, teacherPassword from teacher where teacherAccount=?',
      [ teacherAccount ]
    )
    .then(r => {
      if(r.length === 0) throw { message: '존재하지 않는 아이디입니다.' };
      return r[0];
    })
    .then(async r => {
      if(await bcrypt.compare(teacherPassword, r.teacherPassword)) {
        if(req.session?.user === undefined) {
          req.session.user = {
            tid: r.teacherID,
            id: teacherAccount
          };
        }
      }
      else throw { message: '비밀번호가 일치하지 않습니다.'};
    })

    grace.then(next)
    .catch(e => res.json({ complete: false, message: '인증에 실패했습니다.', cause: e.message }));
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
    const { tid: teacherID } = req.body ?? {};
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
  },
  async changeMyPassword(req, res) {
/* @codingjoa
   자신의 비밀번호를 변경
*/
    const { newpw: tempPW } = req.body;
    const { tid: teacherID } = req.session?.user ?? {};
    const saltRounds = 10;
    const teacherPassword = await bcrypt.hash(tempPW, saltRounds);
    const grace = pool.query(
      'update teacher set teacherPassword=? where teacherID=?',
      [ teacherPassword, teacherID ]
    )
    .then(r => {
      if(r.affectedRows === 0) throw { message: '존재하지 않는 ID입니다.' };
    });

    grace.then(r => res.json({ complete: true, message: '비밀번호 변경에 성공했습니다.' }))
    .catch(e => res.json({ complete: false, message: `db 오류: ${e.message}` }));
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
