

/*
공제 계산식

국민연금 = 기본급 * 4.5%
국민연금(회사) = 기본급 * 4.5%
건강보험 = 기본급 * 3.43%
건강보험(회사) = 기본급 * 3.43%
징기요양보험 = 건강보험 * 11.52% 의 1의자리 버림
장기요양보험(회사) = ?
고용보험 = 지급합계 * 0.8%
고용보험(회사) = 지급합계 * 1.05%
소득세 = ?
지방소득세 = ?
농특세 = ?
*/

const db = require('../poolManager');


const addProceedsQuery = (
`insert into deductionsPrice(
  teacherID,
  lessonMonth,
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
  basic,
  taxable,
  taxFree,
  proceeds
) values (
  ?,?,?,?,?,
  ?,?,?,?,?,
  ?,?,?,?,?,
  ?,?,?
  select
    ? as teacherID,
    ? as lessonMonth,
    ? as NP,
    ? as NPC,
    ? as HI,
    ? as HIC,
    ? as LCI,
    ? as LCIC,
    ? as EI,
    ? as EIC,
    ? as IT,
    ? as LIT,
    ? as SAT,
    ? as deductions,
    ? as basic,
    ? as taxable,
    ? as taxFree,
    ? as proceeds,
    (select
      teacher.teacherName,
      lesson.lessonMonth,
      billing.studentID,
      sum(billing.billingPrice) as income,
      count(billing.studentID) as students,
      count(DISTINCT (lesson.quarterID)) as lessons
    from
      teacher left join
      lesson on
        teacher.teacherID=lesson.teacherID left join
      deductionsPrice on
        lesson.teacherID=deductionsPrice.teacherID and
        lesson.lessonMonth=deductionsPrice.lessonMonth left join
      billing on
        lesson.quarterID=billing.quarterID and
        lesson.lessonMonth=billing.lessonMonth left join
      refund on
        billing.studentID=refund.studentID and
        billing.quarterID=refund.quarterID and
        billing.lessonMonth=refund.lessonMonth
    where
      billing.lessonMonth=lesson.
    group by
      lesson.teacherID,
      lesson.lessonMonth;
    )

)`);

const p10 = p => (Math.floor(p*0.1)) * 10;

async function InsertAll(
  mapped
) {
  if(!db.pool) {
    await db.Boot();
  }
  const conn = await db.pool.getConnection();
  await conn.beginTransaction();

  try {
    await conn.batch(addProceedsQuery,
      mapped
    );
    //await conn.commit();
    const result = await conn.query('select * from deductionsPrice');
    console.log(result);
    await conn.rollback();
  } catch(err) {
    console.error(err);
    await conn.rollback();
  }
  conn.release();
}
function mapper({
  수익,
  공제,
  teacherID,
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
  basic,
  taxable,
  taxFree,
  proceeds
}, lessonMonth) {
  return [
    teacherID,
    lessonMonth,
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
    basic,
    taxable,
    taxFree,
    proceeds
  ];
}
function calculate({
  teacherID,
  basic,
  taxable,
  taxFree = 0
}, {
  NP: 사대보험세율,
  HI: 건강보험세율,
  LCI: 장기요양보험세율,
  EI: 고용보험세율,
  EIC: 고용보험회사세율,
  LIT: 지방소득세율
}) {
  // 지급합계
  const proceeds = basic + taxable;
  const 국민연금 = p10(basic * 사대보험세율);
  const 국민연금회사부담 = 국민연금;
  const 건강보험 = p10(basic * 건강보험세율);
  const 건강보험회사부담 = 건강보험;
  const 장기요양보험 = p10(건강보험 * 장기요양보험세율);
  const 장기요양보험회사부담 = 0;
  const 고용보험 = p10(proceeds * 고용보험세율);
  const 고용보험회사부담 = p10(proceeds * 고용보험회사세율);
  const 소득세 = 0;
  const 지방소득세 = p10(소득세 * 지방소득세율);
  const 농특세 = 0;
  // 공제 합계
  const deductions = 국민연금 + 건강보험 + 장기요양보험 + 고용보험 + 소득세 + 지방소득세 + 농특세;
  return {
    teacherID,
    basic,
    taxable,
    taxFree,
    proceeds,
    NP: 국민연금,
    NPC: 국민연금회사부담,
    HI: 건강보험,
    HIC: 건강보험회사부담,
    LCI: 장기요양보험,
    LCIC: 장기요양보험회사부담,
    EI: 고용보험,
    EIC: 고용보험회사부담,
    IT: 소득세,
    LIT: 지방소득세,
    SAT: 농특세,
    deductions,
    debug: {
      공제: {
        국민연금, 건강보험, 장기요양보험,
        고용보험, 소득세, 지방소득세
      },
      수익: {
        기본급: basic,
        수당: taxable,
        지급합계: proceeds
      }
    }
  }
}
async function addProceeds(
  lessonMonth,
  teachers,
  deductions
) {
  await InsertAll(
    (await teachers.map(p => calculate(p, deductions)).map(p => mapper(p, lessonMonth)))
  );
}


module.exports = async (
  req, res
) => {
  //PUT
  const lessonMonth = req.param?.lessonMonth;
  const deductions = req.body?.deductions;
  const teachers = req.body?.teachers;
  const result = await addProceeds(
    lessonMonth, teachers, deductions
  );
  OK(res, result);
};


// 소득세 계산용
const 공제가족수 = 0;
const 미성년가족수 = 0;
module.id === require.main.id && (async () => {
  const lessonMonth = process.env.LM ?? '2020-10-01';
  const deductions = {
    NP: 0.045, // 사대보험세율
    HI: 0.0343, // 건강보험세율
    LCI: 0.1152, // 장기요양보험세율
    EI: 0.008, // 고용보험세율
    EIC: 0.0105, // 고용보험회사세율
    LIT: 0.1 // 지방소득세율
  };
  const teachers = [{
    teacherID: 1212,
    basic: 1800000,
    taxable: 1200000
  }, {
    teacherID: 1231,
    basic: 2000000,
    taxable: 0
  }];
  await addProceeds(lessonMonth, teachers, deductions);
  //pool.end();
})();
