

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




const addProceedsQuery = (
`insert into deductionsPrice(
  
) values (
  ?,?,?,?,?
)`);

const p10 = p => (Math.floor(p*0.1)) * 10;

async function InsertAll(
  mapped
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    await conn.batch(addProceedsQuery,
      mapped
    );
    await conn.commit();
  } catch(err) {
    await conn.rollback();
  }
  conn.release();
}
function mapper({
  teacherID,
  수익,
  공제
}, lessonMonth) {
  return [
    teacherID, 수익.기본급, lessonMonth
  ];
}
function calculate({
  teacherID,
  기본급,
  수당
}, {
  사대보험세율,
  건강보험세율,
  장기요양보험세율,
  고용보험세율,
  고용보험회사세율,
  지방소득세율
}) {
  const 지급합계 = 기본급 + 수당;
  const 국민연금 = p10(기본급 * 사대보험세율);
  const 국민연금회사부담 = 국민연금;
  const 건강보험 = p10(기본급 * 건강보험세율);
  const 건강보험회사부담 = 건강보험;
  const 장기요양보험 = p10(건강보험 * 장기요양보험세율);
  const 장기요양보험회사부담 = null;
  const 고용보험 = p10(지급합계 * 고용보험세율);
  const 고용보험회사부담 = p10(지급합계 * 고용보험회사세율);
  const 소득세 = 0;
  const 지방소득세 = p10(소득세 * 지방소득세율);
  const 농특세 = null;
  return {
    teacherID,
    수익: {
      기본급, 수당, 지급합계
    },
    공제: {
      국민연금, 건강보험, 장기요양보험,
      고용보험, 소득세, 지방소득세
    }
  }
}
async function addProceeds(
  lessonMonth,
  teachers,
  deductions
) {
  return teachers.map(p => calculate(p, deductions))//.map(p => mapper(p, lessonMonth));
}



const 기본급 = (process.env.P ?? 1800000) - 0;
const 수당 = (process.env.L ?? 1200000) - 0;
const 공제가족수 = 0;
const 미성년가족수 = 0;
module.id === require.main.id && (async () => {
  const lessonMonth = process.env.LM ?? '2020-10-01';
  const deductions = {
    사대보험세율: 0.045,
    건강보험세율: 0.0343,
    장기요양보험세율: 0.1152,
    고용보험세율: 0.008,
    고용보험회사세율: 0.0105,
    지방소득세율: 0.1
  };
  const teachers = [{
    teacherID: 1212,
    기본급,
    수당
  }, {
    teacherID: 1231,
    기본급: 2000000,
    수당: 0
  }];
  const result = await addProceeds(lessonMonth, teachers, deductions);
  console.log(result);
  //pool.end();
})();
