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
  teacherID,
  teacherName,
  teacherAccount,
  teacherOp,
  isForeigner
) {
  const result = await conn.query(((teacherID !== null) ? insertTeacher : insertTeacherAutoIncrement), [
    teacherName, teacherAccount,
    teacherOp, isForeigner, teacherID
  ]);
  if(!(result.insertId>0)) {
    throw new Error('정보가 생성되지 않았습니다.');
  }
  return result.insertId;
}
function accountRegex(teacherAccount) {
  // https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username/12019115
  const regex = /^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-z]+(?<![_.])$/;
  if(!regex.test(teacherAccount)) {
    throw new CommonError('ID는 영어 소문자(2~20자)만 허용됩니다.');
  };
}
async function addTeacher(
  teacherName, teacherAccount,
  teacherOp, isForeigner, teacherJoined, teacherID = null
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    accountRegex(teacherAccount);
    const createdTeacherID = await createTeacher(
      conn,
      teacherID,
      teacherName,
      teacherAccount,
      teacherOp,
      isForeigner
    );
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
  }
};
