/* @codingjoa
개요
   editBilling은 선생 또는 원장이 학생의 입금액을 출석부 마감 이전에 변경할 수 있도록 합니다.
   조건1: 원장이거나 선생이 담당중인 출석부여야 함.
   조건2: billing이 존재하여야 함
   billingRetractable은 상관 없습니다.
   원래는 lessonEnded=1 일때는 수정할 수 없게 하려고 하였으나 잘못 등록되었을 때를 가정하여
   원장 한정으로 수정할 수 있도록 하기 위해 조건에서 제외하였습니다.
파라미터
   studentID = Number
   quarterID = Number
   lessonMonth = String
반환값
   없음
메소드 및 상태코드
   PATCH /teacher/lesson/:quarterID/:lessonMonth/student/:studentID/billing
   200 = 정상
   400 = 예기치 못한 모든 오류
커스텀 미들웨어
   isAuthorized
*/


const { OK, BadRequest, InternalError, CommonError } = require('../format');
const { pool } = require('../poolManager');
const editBillingQuery = (
`update
  (select
    ? as studentID,
    concat(date_format(?, '%Y-%m'), '-01') as lessonMonth,
    ? as billingPayment,
    ? as billingGroup,
    ? as billingPrice,
    ? as billingTaxCode,
    ? as billingScholarshipCode,
    ? as billingUnpaidCode,
    ? as billingRefundPrice,
    ? as billingRefundReason,
    ? as billingRefundAt
  ) as request left join
  billing on
    billing.studentID=request.studentID and
    billing.lessonMonth=request.lessonMonth left join
  lesson on
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth
set
  billing.billingPrice=(case
    when request.billingScholarshipCode=0
    then request.billingPrice
    else 0
  end),
  billing.billingPayment=request.billingPayment,
  billing.billingGroup=request.billingGroup,
  billing.billingTaxCode=(case
    when request.billingScholarshipCode=0
    then request.billingTaxCode
    else 0
  end),
  billing.billingScholarshipCode=request.billingScholarshipCode,
  billing.billingUnpaidCode=(case
    when request.billingScholarshipCode=1
    then 0
    when request.billingPrice<request.billingUnpaidCode
    then request.billingPrice
    else request.billingUnpaidCode
  end),
  billing.billingRefundPrice=(case
    when lesson.lessonEnded=0 and billing.billingRefundMiddleCode=1 and request.billingPrice<request.billingRefundPrice
    then request.billingPrice
    when lesson.lessonEnded=0 and billing.billingRefundMiddleCode=1
    then request.billingRefundPrice
    when lesson.lessonEnded=0 or request.billingScholarshipCode=1
    then null
    when request.billingPrice<request.billingRefundPrice
    then request.billingPrice
    else request.billingRefundPrice
  end),
  billing.billingRefundReason=(case
    when lesson.lessonEnded=0 and billing.billingRefundMiddleCode=1
    then request.billingRefundReason
    when lesson.lessonEnded=0 or request.billingScholarshipCode=1
    then null
    else request.billingRefundReason
  end),
  billing.billingRefundAt=(case
    when lesson.lessonEnded=0 and billing.billingRefundMiddleCode=1
    then request.billingRefundAt
    when lesson.lessonEnded=0 or request.billingScholarshipCode=1
    then null
    else request.billingRefundAt
  end)
limit 1`);
async function editBilling(
  studentID,
  lessonMonth,
  billingPayment,
  billingGroup,
  billingPrice,
  billingTaxCode,
  billingScholarshipCode,
  billingUnpaidCode,
  billingRefundPrice,
  billingRefundReason,
  billingRefundAt
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await conn.query(editBillingQuery, [
      studentID,
      lessonMonth,
      billingPayment,
      billingGroup,
      billingPrice,
      billingTaxCode,
      billingScholarshipCode,
      billingUnpaidCode,
      billingRefundPrice,
      billingRefundReason,
      billingRefundAt
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
  const billingPayment = req.body?.billingPayment;
  const billingGroup = req.body?.billingGroup;
  const billingPrice = req.body?.billingPrice;
  const billingTaxCode = req.body?.billingTaxCode;
  const billingScholarshipCode = req.body?.billingScholarshipCode;
  const billingUnpaidCode = req.body?.billingUnpaidCode;
  const billingRefundPrice = req.body?.billingRefundPrice;
  const billingRefundReason = req.body?.billingRefundReason;
  const billingRefundAt = req.body?.billingRefundAt;
  if(
    studentID===undefined ||
    lessonMonth===undefined ||
    billingPayment===undefined ||
    billingGroup===undefined ||
    billingPrice===undefined ||
    billingTaxCode===undefined ||
    billingScholarshipCode===undefined ||
    billingRefundPrice===undefined ||
    billingRefundReason===undefined ||
    billingUnpaidCode===undefined ||
    billingRefundAt===undefined
  ) {
    BadRequest(res, new CommonError('잘못된 요청을 보냈습니다.'));
    return;
  }
  try {
    const ok = await editBilling(
      studentID,
      lessonMonth,
      billingPayment,
      billingGroup,
      billingPrice,
      billingTaxCode,
      billingScholarshipCode,
      billingUnpaidCode,
      billingRefundPrice,
      billingRefundReason,
      billingRefundAt
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
