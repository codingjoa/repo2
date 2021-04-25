/* @codingjoa
개요
   editQuarterCoach는 quarter 전담 강사를 변경합니다.
   조건1: unused가 아닌 teacher이어야 함
파라미터
   quarterID = Number
   teacherID = Number
반환값
   rows = Array
메소드 및 상태코드
   PATCH /admin/quarter/:quarterID
   200 = 정상
   400 = 예기치 못한 모든 오류
커스텀 미들웨어
   isMaster
*/
const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');
const editQuarterCoachQuery = (
`update
  quarter
set
  teacherID=?
where
  quarterID=? and
  unused=0 and
  ((? in (select
    teacherID
  from
    teacher
  where
    unused=0
  )) or ? is null)
limit 1`);
async function editQuarterCoach(
  quarterID,
  teacherID
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const r = await conn.query(editQuarterCoachQuery, [
      teacherID,
      quarterID,
      teacherID,
      teacherID
    ]);
    if(!r.affectedRows) {
      throw new Error('변경되지 않았습니다.');
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
  const teacherID = req.body?.teacherID;
  try {
    await editQuarterCoach(
      quarterID,
      teacherID
    );
    OK(res);
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const quarterID = process.env?.QID;
  const teacherID = process.env?.TID;
  try {
    const ok = await editQuarterCoach(
      quarterID,
      teacherID
    );
    console.log('done');
  } catch(err) {
    console.error(err);
  }
  pool.end();
})();
