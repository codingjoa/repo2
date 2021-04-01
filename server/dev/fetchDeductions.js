/* @codingjoa
   모듈
*/
const { OK, NotFound, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   SQL 쿼리
*/
const fetchQuery = (
`select
  Q.lessonMonth,
  deductionsMonth.createdAt,
  deductionsMonth.modifiedAt,
  deductionsMonth.version,
  deductionsMonth.NP,
  deductionsMonth.HI,
  deductionsMonth.LCI,
  deductionsMonth.EI,
  deductionsMonth.EIC,
  deductionsMonth.LIT,
  deductionsMonth.SAT,
  P.income,
  P.toVAT,
  P.toTeacher,
  P.deductionsFromTeacher,
  P.deductionsFromCompany,
  allNPC,
  allHIC,
  allLCIC,
  allEIC,
  allNP,
  allHI,
  allLCI,
  allEI,
  allLIT,
  allSAT,
  P.income - P.toVAT - P.toTeacher - P.deductionsFromTeacher - P.deductionsFromCompany - case
    when deductionsMonth.toPresident is null
    then 0
    else deductionsMonth.toPresident
  end as toCompany,
  case
    when deductionsMonth.lessonMonth is null
    then 0
    else 1
  end as RegCode
from
  (select
    concat(date_format(?, '%Y-%m'), '-01') as lessonMonth
  ) as Q left join
  deductionsMonth on
    Q.lessonMonth=deductionsMonth.lessonMonth left join
  (select
    lessonMonth,
    sum(deductions) as deductionsFromTeacher,
    sum(income) as income,
    sum(income * 0.1) as toVAT,
    sum(proceeds) - sum(deductions) as toTeacher,
    sum(NPC + HIC + LCIC + EIC) as deductionsFromCompany,
    sum(NPC) as allNPC,
    sum(HIC) as allHIC,
    sum(LCIC) as allLCIC,
    sum(EIC) as allEIC,
    sum(NP) as allNP,
    sum(HI) as allHI,
    sum(LCI) as allLCI,
    sum(EI) as allEI,
    sum(LIT) as allLIT,
    sum(SAT) as allSAT
  from
    deductionsPrice
  group by
    lessonMonth
  ) as P on
    Q.lessonMonth=P.lessonMonth
`);


/* @codingjoa
   함수
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
  const lessonMonth = req.params?.lessonMonth;
  try {
    const result = await pool.query(fetchQuery, [
      lessonMonth,
      lessonMonth,
      lessonMonth
    ])
    if(!result.length) {
      NotFound(res);
    }
    else {
      OK(res, result[0]);
    }
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const lessonMonth = process.env.LM ?? '2020-11-01';
  try {
    await pool.query(fetchQuery, [
      lessonMonth,
      lessonMonth,
      lessonMonth
    ]).then(console.log, console.error);
  } catch(err) {
    console.error(err);
  }

  pool.end();
})();
