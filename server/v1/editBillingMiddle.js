const { OK, BadRequest, InternalError, CommonError } = require('../format');
const { pool } = require('../poolManager');
const editBillingMiddleQuery = (
`update
  billing left join
  lesson on
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth
set
  billing.billingRefundMiddleCode=1
where
  lesson.lessonEnded=0 and
  billing.billingRetractable=0 and
  billing.studentID=? and
  concat(date_format(?, '%Y-%m'), '-01')=concat(date_format(billing.lessonMonth, '%Y-%m'), '-01')
limit 1`);
async function editBillingMiddle(
  studentID,
  lessonMonth
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await conn.query(editBillingMiddleQuery, [
      studentID,
      lessonMonth
    ]);
    await conn.commit();
    await conn.release();
    return (result.affectedRows===0) ? false : true;
  } catch(err) {
    process.env.ERROR === '1' && console.error(err);
    await conn.rollback();
    await conn.release();
    throw err;
  }
}
module.exports = async function(
  req, res
) {
  const studentID = req.params?.studentID;
  const lessonMonth = req.params?.lessonMonth;
  if(
    studentID===undefined ||
    lessonMonth===undefined
  ) {
    BadRequest(res, new CommonError('잘못된 요청을 보냈습니다.'));
    return;
  }
  try {
    const ok = await editBillingMiddle(
      studentID,
      lessonMonth
    );
    if(ok) {
      OK(res);
    } else {
      BadRequest(res, new Error('변경되지 않았습니다.'));
    }
  } catch(err) {
    InternalError(res, err);
  }
};
