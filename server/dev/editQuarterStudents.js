/* @codingjoa
개요
   editQuarterStudent는 주로 수업받는 반을 지정합니다.
파라미터
   quarterID = Number
   students = Array[ studentID, ]
반환값
   none
메소드 및 상태코드
   POST /teacher/students/:quarterID
   200 = 정상
   400 = 예기치 못한 모든 오류
*/
const { OK, BadRequest, CommonError } = require('../format');
const { pool } = require('../poolManager');
const editQuarterStudentQuery = (
`update
  studentInfo left join
  studentID on
    studentID.studentID=studentInfo.studentID left join
  (select
    billing.studentID,
    sum(billing.billingRetractable=1)=0 as when1
  from
    billing
  group by
    billing.studentID
  ) as billing on
    studentID.studentID=billing.studentID
set
  studentInfo.quarterID=?
where
  studentInfo.studentID=? and
  studentID.unused=0 and
  studentInfo.quarterID is null and
  (billing.when1=1 or billing.when1 is null)
limit 1`);
async function editQuarterStudents(
  students,
  quarterID
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const rows = students.map(studentID => ([ quarterID, studentID ]));
    const r = await conn.batch(editQuarterStudentQuery, rows);
    if(!r.affectedRows) {
      throw new CommonError('변경되지 않았습니다.');
    }
    await conn.commit();
    await conn.release();
  } catch(err) {
    await conn.rollback();
    await conn.release();
    throw err;
  }
}

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const students = req.body?.students;
  try {
    await editQuarterStudents(
      students,
      quarterID
    );
    OK(res);
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const quarterID = process.env?.QID;
  const students= [];
  try {
    const ok = await editQuarterStudents(
      students,
      quarterID
    );
    console.log('done');
  } catch(err) {
    console.error(err);
  }
  pool.end();
})();
