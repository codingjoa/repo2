/* @codingjoa
   모듈
*/
const { OK, NotFound, BadRequest } = require('../format');
const pool = require('../poolManager');
/* @codingjoa
   SQL 쿼리
*/

const fetchQuery = (
`select
  teacher.teacherID,
  lesson.lessonMonth,
  (select
    teacherName
  from
    teacher as T
  where
    teacher.teacherID=T.teacherID
  ) as teacherName,
  (select
    teacherAccount
  from
    teacher as T
  where
    teacher.teacherID=T.teacherID
  ) as teacherAccount,
  sum((case
    when lessonEnded=1
    then 1
    else 0
  end)) as totalStudent,
  sum((case
    when lessonEnded=1
    then billingPrice
    else 0
  end)) as totalPrice,
  case
    when sum((case
      when lessonEnded=1
      then billingPrice*(refundPercent*0.01)
      else 0
    end)) is null
    then 0
    else sum((case
      when lessonEnded=1
      then billingPrice*(refundPercent*0.01)
      else 0
    end))
  end as totalRefundPrice,
  NP,
  NPC,
  HI,
  HIC,
  LCI,
  LCIC,
  EI,
  EIC,
  IT,
  LIT,
  SAT,
  deductions,
  taxable,
  taxFree,
  proceeds,
  income,
  proceeds - deductions as toTeacher,
  case
    when deductionsPrice.teacherID is null
    then 0
    else 1
  end as RegCode
from
  teacherLeaving left join
  teacher on
    teacherLeaving.teacherID=teacher.teacherID left join
  lesson on
    teacher.teacherID=lesson.teacherID left join
  deductionsPrice on
    teacher.teacherID=deductionsPrice.teacherID and
    ?=deductionsPrice.lessonMonth left join
  billing on
    lesson.quarterID=billing.quarterID and
    lesson.lessonMonth=billing.lessonMonth left join
  refund on
    billing.studentID=refund.studentID and
    billing.quarterID=refund.quarterID and
    billing.lessonMonth=refund.lessonMonth
where
  ( date_format(?, '%Y-%m')=date_format(lesson.lessonMonth, '%Y-%m') or
    lesson.lessonMonth is null) and
  ( concat(date_format(?, '%Y-%m'), '-01') between
      teacherLeaving.teacherJoined and
      case
        when teacherLeaving.teacherLeaved is null
        then '9999-12-01'
        else teacherLeaving.teacherLeaved
      end
  )
group by
  teacher.teacherID,
  lesson.lessonMonth;
`);
/* @codingjoa
   함수
*/

/* @codingjoa
   개발용 메모
lesson => 완료 수업수 구하기
billing => 수업으로 얻은 수익 구하기
refund => 환불 총액 구하기

deductionsPrice => 등록한 공제/지급 정보



select

from
  lesson left join
  billing
  left join
  refund


group by
  teacherID,
  lessonMonth

*/

async function fetchProceeds(
  lessonMonth
) {
  // 각 선생별 수당/공제액 표시, 등록 여부도 표시
  // db완성해야 개발가능
// join쿼리 써서 합치고 proceeds테이블쪽에 tid가 없으면 등록0 있으면 등록1
// refundPrice, allPrice도 같이 구해서 수당 구할때 쓸거임
}
/* @codingjoa
   deductionsPrice 테이블 필드 약자
    NP 국민연금
    NPC 국민연금(회사)
    HI 건강보험
    HIC 건강보험(회사)
    LCI 장기요양보험
    LCIC 장기요양보험(회사)
    EI 고용보험
    EIC 고용보험(회사)
    IT 소득세
    LIT 지방소득세
    SAT 농특세
*/

module.exports = async (
  req,
  res
) => {
  const lessonMonth = req.param.id ?? '2020-11-01';
  try {
    const result = await pool.query(fetchQuery, [
      lessonMonth,
      lessonMonth,
      lessonMonth
    ]);
    if(!result.length) {
      NotFound(res);
    }
    else {
      OK(res, result);
    }
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const lessonMonth = process.env.LM ?? '2020-11-01';
  try {
    await pool.query(fetchQuery,[
      lessonMonth,
      lessonMonth,
      lessonMonth
    ]).then(console.log);
  } catch(err) {
    console.error(err);
  }
  //db.pool.end();
  pool.end();
})();
