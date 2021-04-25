const { OK, BadRequest, CommonError } = require('../format');
const { pool } = require('../poolManager');

/*
  lessonMonth = String(yyyy-mm-dd) | Array[ String(yyyy-mm-dd), ]
*/
const addBillingQuery = (
`insert into billing(
  studentID,
  quarterID,
  lessonMonth,
  billingPayment,
  billingGroup,
  billingPrice,
  billingScholarshipCode,
  billingTaxCode,
  billingRetractable
) select
  studentInfo.studentID,
  studentInfo.quarterID,
  studentID.lessonMonth,
  ? as billingPayment,
  ? as billingGroup,
  ? as billingPrice,
  ? as billingScholarshipCode,
  ? as billingTaxCode,
  1 as billingRetractable
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
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth
where
  studentInfo.studentID=? and
  studentID.unused=0 and
  studentInfo.quarterID is not null and
  billing.studentID is null and
  lesson.quarterID is null and
  studentID.lessonMonth>=concat(date_format(current_date, '%Y-%m'), '-01')=1`);
async function addBilling(
  lessonMonth,
  billingPayment,
  billingGroup,
  billingScholarshipCode,
  billingPrice,
  billingTaxCode,
  studentID
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    if(lessonMonth instanceof Array) {
      const rows = lessonMonth.map(lessonMonth => ([
        billingPayment,
        billingGroup,
        (billingScholarshipCode===1 ? 0 : billingPrice),
        billingScholarshipCode,
        (billingScholarshipCode===1 ? 0 : billingTaxCode),
        lessonMonth,
        studentID
      ]));
      for(const row of rows) {
        const r = await conn.query(addBillingQuery, row);
        if(!r.affectedRows) {
          throw new CommonError('변경되지 않았습니다.');
          // 학생이 unused일때, 잘못된 학생 지정, 이미 입금 등록했을 때(등록 희망 기간 중 겹칠 때)
          // 지난 기간을 등록하려고 할 때, 수업이 있는 반을 등록하려고 할 때
        }
      }
    } else {
      const r = await conn.query(addBillingQuery, [
        billingPayment,
        billingGroup,
        (billingScholarshipCode===1 ? 0 : billingPrice),
        billingScholarshipCode,
        (billingScholarshipCode===1 ? 0 : billingTaxCode),
        lessonMonth,
        studentID
      ]);
      if(!r.affectedRows) {
        throw new CommonError('변경되지 않았습니다.');
      }
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
  const lessonMonth = req.body?.lessonMonth;
  const billingPayment = req.body?.billingPayment;
  const billingGroup = req.body?.billingGroup;
  const billingScholarshipCode = req.body?.billingScholarshipCode;
  const billingPrice = req.body?.billingPrice;
  const billingTaxCode = req.body?.billingTaxCode;
  if(
    !studentID===undefined ||
    !lessonMonth===undefined ||
    !billingPayment===undefined ||
    !billingGroup===undefined ||
    !billingScholarshipCode===undefined ||
    !billingPrice===undefined ||
    !billingTaxCode===undefined
  ) {
    BadRequest(res, new Error('잘못된 요청을 보냈습니다.'));
    return;
  }
  try {
    await addBilling(
      lessonMonth,
      billingPayment,
      billingGroup,
      billingScholarshipCode,
      billingPrice,
      billingTaxCode,
      studentID
    );
    OK(res);
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const studentID = process.env?.SID ?? 21;
  const lessonMonth = process.env?.LM ?? [ '2022-01-01', '2022-02-01', '2022-03-01' ];
  const billingPayment = process.env?.BPAY ?? 0;
  const billingGroup = process.env?.BGROUP ?? 0;
  const billingScholarshipCode = process.env?.BSCH ?? 1;
  const billingPrice = process.env?.BPRICE ?? 0;
  const billingTaxCode = process.env?.BTAX ?? 0;
  try {
    await addBilling(
      lessonMonth,
      billingPayment,
      billingGroup,
      billingScholarshipCode,
      billingPrice,
      billingTaxCode,
      studentID
    ).then(console.log);
  } catch(err) {
    console.error(err);
  }
  pool.end();
})();
