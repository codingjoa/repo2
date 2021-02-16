const { BadRequest } = require('../format');
const { pool } = require('../poolManager');

const insertTeacherQuery = (
`insert into teacher(
  teacherName,
  teacherAccount,
  teacherPassword,
  teacherOp
) values (
  ?,
  ?,
  0,
  ?
)`);
const insertTeacherLeavingQuery = (
`insert into teacherLeaving(
  teacherID,
  teacherJoined
) values (
  ?,
  ?
)`);

async function addTeacher(
  teacherName,
  teacherAccount,
  teacherOp
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    // teacher 테이블
    const { insertId: teacherID } = await conn.query(
      insertTeacherQuery,
      [ teacherName, teacherAccount, teacherOp ]
    );
    if(!(teacherID>0)) {
      throw new Error('선생님 정보가 생성되지 않았습니다.');
    }
    // teacherLeaving
    const atMonth = new Date();
    await conn.query(insertTeacherLeavingQuery,
      [ teacherID,
        `${atMonth.getFullYear()}-${atMonth.getMonth()+1}-01`
      ]
    );
    console.log(
      await conn.query('select * from teacherLeaving where teacherID=?', [ teacherID ])
    );
    conn.commit();
    conn.release();
    return teacherID;
  } catch(err) {
    conn.rollback();
    conn.release();
    throw err;
  }
  
}

module.exports = async function(
  req, res, next
) {
/* @codingjoa
   메소드: POST
   파라미터:
    teacherName 선생님 이름
    teacherAccount 선생님 로그인 id
    teacherOp 관리자 여부
   선생님 정보를 새로 생성
   임시 비밀번호는 regeneratePassword로 넘김
   400 BadRequest
*/
  const teacherName = req.body?.teacherName;
  const teacherAccount = req.body?.id;
  const teacherOp = req.body?.teacherOp ?? 0;
  if(teacherAccount==='admin') {
    BadRequest(res, new Error('admin 계정은 생성할 수 없습니다.'));
    return;
  }
  try {
    req.next.teacherID = await addTeacher(teacherName, teacherAccount, teacherOp);
    next();
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  await addTeacher(
    '정치영',
    'rel',
    0
  ).then(console.log, console.error);
  pool.end();
})();
