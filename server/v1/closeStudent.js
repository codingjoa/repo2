const { OK, BadRequest, InternalError } = require('../format');
const { pool } = require('../poolManager');
const deleteBillingQuery = (
`delete from
  billing
where
  billing.studentID=? and
  billing.billingRetractable=1`);
const updateStudentQuery = (
`update studentID set unused=1 where studentID=? limit 1`);

module.exports = async function(
  req, res
) {
  const studentID = req.params?.studentID;
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await conn.query(updateStudentQuery, [
      studentID
    ]);
    if(result.affectedRows !== 0) {
      await conn.query(deleteBillingQuery, [
        studentID
      ]);
      OK(res);
      await conn.commit();
    } else {
      BadRequest(res, new Error('학생 ID를 잘못 지정했습니다.'));
      await conn.rollback();
    }
    await conn.release();
  } catch(err) {
    InternalError(res, err);
    await conn.rollback();
    await conn.release();
  }
};
