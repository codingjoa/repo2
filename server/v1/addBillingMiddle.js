const { OK, BadRequest, CommonError } = require('../format');
const { pool } = require('../poolManager');
const createCheckingMiddleQuery = (
`insert into checking(quarterID, lessonMonth, studyWeek, studentID)
select
  billing.quarterID,
  billing.lessonMonth,
  study.studyWeek,
  billing.studentID
from
  billing left join
  study on
    billing.quarterID=study.quarterID and
    billing.lessonMonth=study.lessonMonth
where
  date_format(current_date, '%Y-%m')>=date_format(billing.lessonMonth, '%Y-%m') and
  date_format(?, '%Y-%m')=date_format(billing.lessonMonth, '%Y-%m') and
  billing.studentID=? and
  billing.billingMiddleRegCode=1 and
  study.studyWeek is not null and
  study.studyWeek >= ?`);
const addBillingMiddleQuery = (
`insert into billing(
  studentID,
  quarterID,
  lessonMonth,
  billingPayment,
  billingGroup,
  billingPrice,
  billingScholarshipCode,
  billingTaxCode,
  billingUnpaidCode,
  billingRetractable,
  billingMiddleRegCode
) select
  studentInfo.studentID,
  studentInfo.quarterID,
  studentID.lessonMonth,
  ? as billingPayment,
  ? as billingGroup,
  ? as billingPrice,
  ? as billingScholarshipCode,
  ? as billingTaxCode,
  ? as billingUnpaidCode,
  0 as billingRetractable,
  1 as billingMiddleRegCode
from
  (select
    studentID.*,
    concat(date_format(?, '%Y-%m'), '-01') as lessonMonth
  from
    studentID
  ) as studentID left join
  studentInfo on
    studentID.studentID=studentInfo.studentID left join
  billing on
    studentID.studentID=billing.studentID and
    studentID.lessonMonth=billing.lessonMonth left join
  lesson on
    studentInfo.quarterID=lesson.quarterID and
    studentID.lessonMonth=lesson.lessonMonth
where
  studentInfo.studentID=? and
  studentID.unused=0 and
  studentInfo.quarterID is not null and
  billing.studentID is null and
  lesson.quarterID is not null and
  lesson.lessonEnded=0 and
  studentID.lessonMonth<=concat(date_format(current_date, '%Y-%m'), '-01')=1`);

async function addBillingMiddle(
  lessonMonth,
  billingPayment,
  billingGroup,
  billingScholarshipCode,
  billingPrice,
  billingTaxCode,
  billingUnpaidCode,
  studentID,
  startStudyWeek
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const r = await conn.query(addBillingMiddleQuery, [
      billingPayment,
      billingGroup,
      (billingScholarshipCode===1 ? 0 : billingPrice),
      billingScholarshipCode,
      (billingScholarshipCode===1 ? 0 : billingTaxCode),
      billingUnpaidCode,
      lessonMonth,
      studentID
    ]);
    if(r.affectedRows === 0) {
      throw new CommonError('등록할 수 없는 입금 내역입니다.');
    }
    const s = await conn.query(createCheckingMiddleQuery, [
      lessonMonth,
      studentID,
      startStudyWeek
    ]);
    if(s.affectedRows === 0) {
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
  const lessonMonth = req.params?.lessonMonth;
  const billingPayment = req.body?.billingPayment;
  const billingGroup = req.body?.billingGroup;
  const billingScholarshipCode = req.body?.billingScholarshipCode;
  const billingPrice = req.body?.billingPrice;
  const billingTaxCode = req.body?.billingTaxCode;
  const startStudyWeek = req.body?.startStudyWeek;
  const billingUnpaidCode = req.body?.billingUnpaidCode;
  if(
    studentID===undefined ||
    lessonMonth===undefined ||
    billingPayment===undefined ||
    billingGroup===undefined ||
    billingScholarshipCode===undefined ||
    billingPrice===undefined ||
    billingTaxCode===undefined ||
    startStudyWeek===undefined ||
    billingUnpaidCode===undefined
  ) {
    BadRequest(res, new Error('잘못된 요청을 보냈습니다.'));
    return;
  }
  try {
    await addBillingMiddle(
      lessonMonth,
      billingPayment,
      billingGroup,
      billingScholarshipCode,
      billingPrice,
      billingTaxCode,
      billingUnpaidCode,
      studentID,
      startStudyWeek
    );
    OK(res);
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const studentID = process.env?.SID ?? 21;
  const lessonMonth = process.env?.LM ?? '2021-03-01';
  const billingPayment = process.env?.BPAY ?? 0;
  const billingGroup = process.env?.BGROUP ?? 0;
  const billingScholarshipCode = process.env?.BSCH ?? 1;
  const billingPrice = process.env?.BPRICE ?? 0;
  const billingTaxCode = process.env?.BTAX ?? 0;
  const startStudyWeek = process.env?.SSW ?? 3;
  const billingUnpaidCode = process.env?.BUNPAY ?? 0;
  try {
    await addBillingMiddle(
      lessonMonth,
      billingPayment,
      billingGroup,
      billingScholarshipCode,
      billingPrice,
      billingTaxCode,
      billingUnpaidCode,
      studentID,
      startStudyWeek
    ).then(console.log);
  } catch(err) {
    console.error(err);
  }
  pool.end();
})();
