const { BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   반 정보를 삭제
*/
const insertTeacherJoined = (
`insert into teacherLeaving(
  teacherJoined,
  teacherID
) values (
  ?,
  ?
)
`);
const insertTeacherAutoIncrement = (
`insert into teacher(
  teacherName, teacherAccount, teacherPassword,
  teacherOp, isForeigner
) values(
  ?, ?, 0, ?, ?
)`);
const insertTeacher = (
`insert into teacher(
  teacherName, teacherAccount, teacherPassword,
  teacherOp, isForeigner, teacherID
) values (
  ?, ?, 0, ?, ?, ?
)`);

async function addTeacher(
  teacherName, teacherAccount,
  teacherOp, isForeigner, teacherJoined, teacherID = null
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await conn.query(((teacherID !== null) ? insertTeacher : insertTeacherAutoIncrement), [
      teacherName, teacherAccount,
      teacherOp, isForeigner, teacherID
    ]);
    if(!(result.insertId>0)) throw new Error('정보가 생성되지 않았습니다.');
    await conn.query(insertTeacherJoined, [
      teacherJoined, result.insertId
    ]);
    await conn.commit();
    await conn.release();
    return result.insertId;
  } catch(err) {
    await conn.rollback();
    await conn.release();
    throw err;
  }
}

module.exports = async function(
  req, res, next
) {
/* @codingjoa
   POST
   선생님 정보를 새로 생성
   임시 비밀번호는 regeneratePassword로 넘김
   400 BadRequest
*/
  const teacherName = req.body?.teacherName; // 1.0
  const teacherAccount = req.body?.id; // 1.0
  const teacherOp = req.body?.teacherOp ?? 0; // 1.0
  const isForeigner = req.body?.isForeigner ?? 0; // 1.4
  const teacherJoined = req.body?.teacherJoined ?? null; // 1.4
  const teacherID = req.body?.teacherID ?? null; // 1.5
  if(teacherAccount==='admin') {
    BadRequest(res, new Error('admin 계정은 생성할 수 없습니다.'));
    return;
  }
  try {
    const result = await addTeacher(
      teacherName, teacherAccount,
      teacherOp, isForeigner, teacherJoined, teacherID
    );
    req.next.teacherID = result;
    next();
  } catch(err) {
    BadRequest(res, err);
    console.error(err);
  }
};
