const { OK, NotFound, InternalError } = require('../format');
const { pool } = require('../poolManager');
const fetchBillingQuery = (
`select
  quarter.quarterID,
  quarter.quarterName,
  request.lessonMonth,
  request.studentID,
  request.studentName,
  billing.billingPayment,
  billing.billingGroup,
  billing.billingPrice,
  billing.billingRetractable,
  billing.billingScholarshipCode,
  billing.billingTaxCode,
  billing.billingUnpaidCode,
  case
    when lesson.lessonEnded=1 or billing.billingRefundMiddleCode=1
    then billing.billingRefundAt
    else null
  end as billingRefundAt,
  case
    when lesson.lessonEnded=1 or billing.billingRefundMiddleCode=1
    then billing.billingRefundReason
    else null
  end as billingRefundReason,
  case
    when lesson.lessonEnded=1 or billing.billingRefundMiddleCode=1
    then billing.billingRefundPrice
    else null
  end as billingRefundPrice,
  case
    when lesson.lessonEnded is not null
    then lesson.lessonEnded=1 or ifnull(billing.billingRefundMiddleCode=1, 0)
    else 0
  end as billingRefundEditable,
  case
    when billing.studentID is null
    then 0
    else 1
  end as billingRegCode,
  lesson.quarterID is not null as lessonRegCode
from
  (select
    studentID.studentID,
    studentInfo.studentName,
    studentInfo.quarterID,
    concat(date_format(?, '%Y-%m'), '-01') as lessonMonth
  from
    studentID left join
    studentInfo on
      studentID.studentID=studentInfo.studentID
  where
    studentID.studentID=?
  ) as request left join
  billing on
    request.studentID=billing.studentID and
    request.lessonMonth=billing.lessonMonth left join
  quarter on
    case when billing.quarterID is null then request.quarterID else billing.quarterID end=quarter.quarterID left join
  lesson on
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth`);
async function fetchBilling(
  lessonMonth,
  studentID,
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const rows = await conn.query(fetchBillingQuery, [
      lessonMonth,
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
  const lessonMonth = req.params?.lessonMonth;
  try {
    const rows = await fetchBilling(
      lessonMonth,
      studentID
    );
    !rows.length && NotFound(res);
    rows.length && OK(res, rows[0]);
  } catch(err) {
    InternalError(res, err);
  }
};
module.id === require.main.id && (async () => {
  const studentID = process.env?.SID ?? 10;
  const lessonMonth = process.env?.LM ?? '2020-10-01';
  await fetchBilling(
    lessonMonth,
    studentID
  ).then(console.log, console.error);
  pool.end();
})();
