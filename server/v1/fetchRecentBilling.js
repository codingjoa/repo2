const { OK, NotFound, InternalError } = require('../format');
const { pool } = require('../poolManager');
const fetchRecentBillingQuery = (
`select
  billing.quarterID,
  (select quarterName from quarter where billing.quarterID=quarter.quarterID) as quarterName,
  student.lessonMonthLast,
  student.studentID,
  student.studentName,
  billing.billingPayment,
  billing.billingGroup,
  billing.billingPrice,
  billing.billingRetractable,
  billing.billingScholarshipCode,
  billing.billingTaxCode
from
(select
  studentInfo.studentID,
  studentInfo.studentName,
  max(lesson.lessonMonth) as lessonMonthLast
from
  studentInfo left join
  billing on
    studentInfo.studentID=billing.studentID left join
    lesson on
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth
  where
    studentInfo.studentID=?
) as student left join
billing on
  billing.studentID=student.studentID and
  billing.lessonMonth=student.lessonMonthLast left join
lesson on
  billing.quarterID=lesson.quarterID and
  billing.lessonMonth=lesson.lessonMonth`);
async function fetchRecentBilling(
  studentID,
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const rows = await conn.query(fetchRecentBillingQuery, [
      studentID
    ]);
    await conn.commit();
    await conn.release();
    return rows;
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
    const rows = await fetchRecentBilling(
      studentID
    );
    if(rows.length === 0) {
      NotFound(res);
    }
    OK(res, rows[0]);
  } catch(err) {
    InternalError(res, err);
  }
};
