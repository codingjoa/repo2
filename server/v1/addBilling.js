const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');


/* @codingjoa
   학생을 반에 수강 등록
*/
const addQuery = (
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
) values (
  ?,
  ?,
  concat(date_format(?, '%Y-%m'), '-01'),
  ?,
  ?,
  ?,
  ?,
  ?,
  1)`
);
async function* gen(
  reqIter
) {

}
async function addBilling(
  lessonMonth,
  reqIter
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    for(const {
      studentID,
      quarterID,
      billingPayment,
      billingGroup,
      billingPrice,
      billingScholarshipCode,
      billingTaxCode
    } of reqIter) {
      await conn.query(addQuery, [
        studentID,
        quarterID,
        lessonMonth,
        billingPayment,
        billingGroup,
        (billingScholarshipCode===1 ? 0 : billingPrice),
        billingScholarshipCode,
        (billingScholarshipCode===1 ? 0 : billingTaxCode)
      ]);
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
  const lessonMonth = req.params?.lessonMonth;
  const reqIter = req.body?.reqIter;
  if(!reqIter) {
    BadRequest(res, new Error('잘못된 요청을 보냈습니다.'));
    return;
  }
  try {
    await addBilling(
      lessonMonth,
      reqIter
    );
    OK(res);
  } catch(err) {
    BadRequest(res, err);
  }


/*
  const promise = reqIter.map(({
    studentID,
    quarterID,
    billingPayment,
    billingGroup,
    billingPrice
  }) => pool.query(addQuery,
    [ studentID, quarterID, lessonMonth, billingPayment, billingGroup, billingPrice ]
  ));
  Promise.all(promise)
  .then(r => OK(res))
  .catch(e => BadRequest(res, e));*/
};
