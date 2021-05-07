/* @codingjoa
개요
   closeTeacher는 특정 ID의 팀을 사용하지 않는 팀으로 변경합니다.
   quarter.teacherID=null 강사님을 팀 담당에서 해제시킵니다.
   quarter.unused=1 해당 quarterID row를 비활성화합니다.
   studentInfo.quarterID 해당 반에 수강하기로 예정된 모든 학생을 해제시킵니다.
파라미터
   quarterID = Number
반환값
   없음
메소드 및 상태코드
   DELETE /admin/quarter/:quarterID
   200 = 정상
   400 = 예기치 못한 모든 오류
커스텀 미들웨어
   isAuthorized
*/
const { OK, BadRequest, CommonError } = require('../format');
const { pool } = require('../poolManager');
const closeQuarterQuery = (
`update
  quarter
set
  quarter.teacherID=null,
  quarter.unused=1
where
  quarter.quarterID=? and
  unused=0
limit 1`);
const setNullQuery = (
`update
  studentInfo
set
  studentInfo.quarterID=null
where
  studentInfo.quarterID=?`);
async function closeQuarter(
  quarterID
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const { affectedRows } = await conn.query(closeQuarterQuery, [
      quarterID
    ]);
    if(!affectedRows) {
      throw new CommonError('변경되지 않았습니다.');
    }
    await conn.query(setNullQuery, [
      quarterID
    ]);
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
  try {
    if(!quarterID) {
      throw new CommonError('ID 지정이 잘못 되었습니다.');
    }
    await closeQuarter(
      quarterID
    );
    OK(res);
  } catch(err) {
    BadRequest(res, err);
  }
};
