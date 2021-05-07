const { CommonError } = require('../format');
const { pool } = require('../poolManager');
const isOwnStudentQuery = (
`select
  quarter.quarterID is not null
from
  studentInfo left join
  quarter on
    quarter.quarterID=studentInfo.quarterID
where
  quarter.teacherID=? and
  studentInfo.studentID=?`);

async function isOwnStudent(
  teacherID,
  studentID
) {
  const result = await pool.query(isOwnStudentQuery, [
    teacherID,
    studentID
  ]);
  if(result.length === 0) {
    throw new CommonError('학생을 관리할 권한이 없습니다.');
  }
}
module.exports = async function(
  req, res, next
) {
  try {
    const teacherID = req.session?.tid;
    const studentID = req.params?.studentID;
    await isOwnStudent(
      teacherID,
      studentID
    );
    next();
  } catch(err) {
    next(err);
  }
};
