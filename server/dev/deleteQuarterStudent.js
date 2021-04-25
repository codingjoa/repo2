/* @codingjoa
개요
   deleteQuarterStudent는 주로 수업받는 반을 없앱니다.
파라미터
   studentID = Number
반환값
   rows = Array
메소드 및 상태코드
   DELETE /teacher/student/:studentID
   200 = 정상
   400 = 예기치 못한 모든 오류
*/
const { OK, BadRequest, CommonError } = require('../format');
const { pool } = require('../poolManager');
const deleteQuarterStudentQuery = (
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
  studentInfo.quarterID=null
where
  studentInfo.studentID=? and
  studentID.unused=0 and
  studentInfo.quarterID is not null and
  (billing.when1=1 or billing.when1 is null)
limit 1`);
async function deleteQuarterStudent(
  studentID
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const r = await conn.query(deleteQuarterStudentQuery, [ studentID ]);
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
  const studentID = req.params?.studentID;
  try {
    await deleteQuarterStudent(
      studentID
    );
    OK(res);
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const studentID = process.env?.SID;
  try {
    const ok = await deleteQuarterStudent(
      studentID
    );
    console.log('done');
  } catch(err) {
    console.error(err);
  }
  pool.end();
})();
