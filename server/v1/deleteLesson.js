const { OK, BadRequest, CommonError, InternalError } = require('../format');
const { pool } = require('../poolManager');
const deleteCheckingQuery = (
`delete from
  checking
where
  quarterID=3 and
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')`);
const deleteStudyQuery = (
`delete from
  study
where
  quarterID=3 and
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')`);
const deleteLessonQuery = (
`delete from
  lesson
where
  quarterID=? and
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')`);
const updateBillingQuery = (
`update
  billing
set
  billingMiddleRegCode=0,
  billingRetractable=1,
  billingRefundReason=null,
  billingRefundPrice=null,
  billingRefundMiddleCode=null,
  billingRefundAt=null
where
  quarterID=? and
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and
  billingRetractable=0`);
async function affected(queryResult, message) {
  const result = await queryResult;
  if(result.affectedRows === 0) {
    throw new CommonError(message);
  }
  return result;
}
async function deleteLesson(
  quarterID,
  lessonMonth
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    await affected(
      conn.query(deleteLessonQuery, [
        quarterID,
        lessonMonth
      ]),
      '수업이 존재하지 않습니다.'
    );
    await conn.query(deleteCheckingQuery, [
      quarterID,
      lessonMonth
    ]),
    await conn.query(deleteStudyQuery, [
      quarterID,
      lessonMonth
    ]);
    await conn.query(updateBillingQuery, [
      quarterID,
      lessonMonth
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
  const lessonMonth = req.params?.lessonMonth;
  try {
    await deleteLesson(
      quarterID,
      lessonMonth
    );
    OK(res);
  } catch(err) {
    if(err instanceof CommonError) {
      BadRequest(res, err);
    } else {
      InternalError(res, err);
    }
  }
};
