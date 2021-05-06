const { CommonError } = require('../format');
const { pool } = require('../poolManager');
const insertTeacherJoined = (
`insert into teacherLeaving(
  teacherJoined,
  teacherID
) values (
  ?,
  ?
)`);
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

// 리팩토링의 일환
async function createTeacher(
  conn,
  teacherID
) {
  const result = await conn.query(((teacherID !== null) ? insertTeacher : insertTeacherAutoIncrement), [
    teacherName, teacherAccount,
    teacherOp, isForeigner, teacherID
  ]);
  if(!(result.insertId>0)) {
    throw new Error('정보가 생성되지 않았습니다.');
  }
  return result.insretId;
}
function accountRegex(teacherAccount) {
  //const regex = /^(?=[a-zA-Z0-9._]{2,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
}
async function addTeacher(
  teacherName, teacherAccount,
  teacherOp, isForeigner, teacherJoined, teacherID = null
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    // todo:  영어 아이디만 넣을 수 있게 바꿀것
    const createdTeacherID = await createTeacher(conn, teacherID);
    await conn.query(insertTeacherJoined, [
      teacherJoined, createdTeacherID
    ]);
    await conn.commit();
    await conn.release();
    return createdTeacherID;
  } catch(err) {
    await conn.rollback();
    await conn.release();
    throw err;
  }
}
module.exports = async function(
  req, res, next
) {
  try {
    const teacherName = req.body?.teacherName; // 1.0
    const teacherAccount = req.body?.id; // 1.0
    const teacherOp = req.body?.teacherOp ?? 0; // 1.0
    const isForeigner = req.body?.isForeigner ?? 0; // 1.4
    const teacherJoined = req.body?.teacherJoined ?? null; // 1.4
    const teacherID = req.body?.teacherID ?? null; // 1.5
    if(teacherAccount==='admin') {
      throw new CommonError('admin 계정은 생성할 수 없습니다.');
    }
    const createdTeacherID = await addTeacher(
      teacherName, teacherAccount,
      teacherOp, isForeigner, teacherJoined, teacherID
    );
    req.next.teacherID = createdTeacherID;
    next(); // regeneratePassword
  } catch(err) {
    next(err);
    console.error(err);
  }
};
