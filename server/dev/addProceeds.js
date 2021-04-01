

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

const { pool } = require('../poolManager');
const { OK, BadRequest } = require('../format');
const { all } = require('./sod');

const addDeductionsQuery = (
`insert into deductionsMonth(
  lessonMonth,
  version
) values (
  concat(date_format(?, '%Y-%m'), '-01'),
  '2021년 기준식'
)`);
const addProceedsQuery = (
`insert into deductionsPrice(
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
  proceeds,
  teacherID,
  lessonMonth,
  income,
  students,
  lesson,
  refunds
) select
    *
  from
    (select
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
      ? as proceeds
    ) as K,
    (select
      teacher.teacherID,
      teacher.lessonMonth,
      sum(
        case
          when lesson.lessonEnded=1 and billing.billingRetractable=0 and billing.billingScholarshipCode=0 and billingScholarshipCode=0
          then billing.billingPrice * (0.01 * (100 - case when refund.studentID is null then 0 else refund.refundPercent end))
          else 0
        end
      ) as income,
      count(
        case
          when lesson.lessonEnded=1 and billing.billingRetractable=0 and billing.billingScholarshipCode=0
          then billing.studentID
          else null
        end
      ) as students,
      count(DISTINCT (
        case
          when lesson.lessonEnded=1
          then lesson.quarterID
          else null
        end
      )) as lesson,
      sum(
        case
          when refund.studentID is null
          then 0
          else 1
        end
      ) as refunds
    from
      (select
        teacher.*,
        concat(date_format(?, '%Y-%m'), '-01') as lessonMonth
      from
        teacher
      ) as teacher left join
      lesson on
        teacher.lessonMonth=lesson.lessonMonth and
        teacher.teacherID=lesson.teacherID left join
      deductionsPrice on
        lesson.lessonEnded=1 and
        lesson.teacherID=deductionsPrice.teacherID and
        lesson.lessonMonth=deductionsPrice.lessonMonth left join
      billing on
        lesson.quarterID=billing.quarterID and
        lesson.lessonMonth=billing.lessonMonth left join
      refund on
        billing.studentID=refund.studentID and
        billing.quarterID=refund.quarterID and
        billing.lessonMonth=refund.lessonMonth
    group by
      teacher.teacherID,
      lesson.lessonMonth
    ) as L
  where
    L.teacherID=?`);
const checkDeductionsRegQuery = (
`select
  case
    when createdAt<>null
    then 1
    else 0
  end as RegCode
from
  deductionsMonth
where
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')`
);
const checkProceedsRegQuery = (
`select
  concat('{', group_concat(concat('"', teacherID, '": [', RegCode, ',', isForeigner, ']')), '}') as json
from
  (select
    1 as Groups,
    teacher.teacherID,
    teacher.isForeigner,
    case
      when deductionsPrice.teacherID is null
      then 0
      else 1
    end as RegCode
  from
    (select
      teacher.*,
      concat(date_format(?, '%Y-%m'), '-01') as lessonMonth
    from
      teacherLeaving left join
      teacher on
        teacherLeaving.teacherID=teacher.teacherID
      where
        concat(date_format(?, '%Y-%m'), '-01') between
          concat(date_format(teacherLeaving.teacherJoined, '%Y-%m'), '-01') and
          case
            when teacherLeaving.teacherLeaved is null
            then '9999-12-02'
            else concat(date_format(teacherLeaving.teacherLeaved, '%Y-%m'), '-02')
          end
    ) as teacher left join
    deductionsPrice on
      teacher.teacherID=deductionsPrice.teacherID and
      teacher.lessonMonth=deductionsPrice.lessonMonth
  ) as Groups
group by
  Groups.Groups
`);
const editDeductionsQuery = (
`update
  deductionsMonth
set
  version='2021년 기준식'
where
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')
`);
const editProceedsQuery = (
`update
  deductionsPrice,
  (select
      *
    from
      (select
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
        ? as proceeds
      ) as K,
      (select
        teacher.teacherID,
        teacher.lessonMonth,
        sum(
          case
            when lesson.lessonEnded=1 and billing.billingRetractable=0 and billing.billingScholarshipCode=0
            then billing.billingPrice * (0.01 * (100 - case when refund.studentID is null then 0 else refund.refundPercent end))
            else 0
          end
        ) as income,
        count(
          case
            when lesson.lessonEnded=1 and billing.billingRetractable=0 and billing.billingScholarshipCode=0
            then billing.studentID
            else null
          end
        ) as students,
        count(DISTINCT (
          case
            when lesson.lessonEnded=1
            then lesson.quarterID
            else null
          end
        )) as lesson,
        sum(
          case
            when refund.studentID is null
            then 0
            else 1
          end
        ) as refunds
      from
        (select
          teacher.*,
          concat(date_format(?, '%Y-%m'), '-01') as lessonMonth
        from
          teacher
        ) as teacher left join
        lesson on
          teacher.lessonMonth=lesson.lessonMonth and
          teacher.teacherID=lesson.teacherID left join
        deductionsPrice on
          lesson.lessonEnded=1 and
          lesson.teacherID=deductionsPrice.teacherID and
          lesson.lessonMonth=deductionsPrice.lessonMonth left join
        billing on
          lesson.quarterID=billing.quarterID and
          lesson.lessonMonth=billing.lessonMonth left join
        refund on
          billing.studentID=refund.studentID and
          billing.quarterID=refund.quarterID and
          billing.lessonMonth=refund.lessonMonth
      group by
        teacher.teacherID,
        lesson.lessonMonth
      ) as L
    where
      L.teacherID=?
  ) as A
set
  deductionsPrice.NP=A.NP,
  deductionsPrice.NPC=A.NPC,
  deductionsPrice.HI=A.HI,
  deductionsPrice.HIC=A.HIC,
  deductionsPrice.LCI=A.LCI,
  deductionsPrice.LCIC=A.LCIC,
  deductionsPrice.EI=A.EI,
  deductionsPrice.EIC=A.EIC,
  deductionsPrice.IT=A.IT,
  deductionsPrice.LIT=A.LIT,
  deductionsPrice.SAT=A.SAT,
  deductionsPrice.deductions=A.deductions,
  deductionsPrice.basic=A.basic,
  deductionsPrice.taxable=A.taxable,
  deductionsPrice.taxFree=A.taxFree,
  deductionsPrice.proceeds=A.proceeds,
  deductionsPrice.income=A.income,
  deductionsPrice.students=A.students,
  deductionsPrice.lesson=A.lesson,
  deductionsPrice.refunds=A.refunds
where
  deductionsPrice.teacherID=A.teacherID and
  deductionsPrice.lessonMonth=A.lessonMonth`);

const p10 = p => (Math.floor(p*0.1)) * 10;

function mapper({
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
    proceeds,
    lessonMonth,
    teacherID
  ];
}
function calculate({
  teacherID,
  basic,
  taxable,
  taxFree = 0,
  people = 1,
  sPeople = 0
}, {
  NP: 사대보험세율,
  HI: 건강보험세율,
  LCI: 장기요양보험세율,
  EI: 고용보험세율,
  EIC: 고용보험회사세율,
  LIT: 지방소득세율
},
  teacherStatus,
  teacherLen
) {
  // 지급합계
  const basic0 = basic === null ? 0 : basic;
  const taxable0 = taxable === null ? 0 : taxable;
  const proceeds = basic0 + taxable0;
  const [ RegCode, isForeigner ] = teacherStatus[teacherID] ?? [];
  // 내국인, 10명 미만, 근로소득 2,200,000원 미만일 경우 국민연금 80% 지원
  const target = (isForeigner === 0 && teacherLen < 10 && basic0 < 2200000);
  const 국민연금 = p10(basic0 * 사대보험세율 * (target ? 0.2 : 1));
  const 국민연금회사부담 = 국민연금;
  const 건강보험 = p10(basic0 * 건강보험세율);
  const 건강보험회사부담 = 건강보험;
  const 장기요양보험 = p10(건강보험 * 장기요양보험세율);
  const 장기요양보험회사부담 = 0;
  const 고용보험 = p10(proceeds * 고용보험세율);
  const 고용보험회사부담 = p10(proceeds * 고용보험회사세율);
  const 소득세 = all(proceeds, people, sPeople);
  const 지방소득세 = p10(소득세 * 지방소득세율);
  const 농특세 = 0;
  // 공제 합계
  const deductions = 국민연금 + 건강보험 + 장기요양보험 + 고용보험 + 소득세 + 지방소득세 + 농특세;
  return {
    teacherID,
    basic: basic0,
    taxable: taxable0,
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
    RegCode,
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
  let conn = 0;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    // deductionsPrice 테이블에 기록이 있는지 없는지 여부 + 내국인 외국인 여부를 확인
    process.env.DEBUG === '1' && console.log(lessonMonth);
    const result = await conn.query(checkProceedsRegQuery, [ lessonMonth, lessonMonth ]);
    process.env.DEBUG === '1' && console.log(result);
    if(!result.length) {
      throw new Error('teacher list is empty');
    }
    const Regs = JSON.parse(result[0].json);
    process.env.DEBUG === '1' && console.log(Regs);
    const insertFunctions = teachers.map(p => calculate(p, deductions, Regs, Object.entries(Regs).length)).map(({
      RegCode, ...rest
    }) => (async () => {
      const map = mapper(rest, lessonMonth);
      //const [ code, isForeigner ] = Regs[map[17]];
      process.env.DEBUG === '1' && console.log(map);
      if(RegCode === 1) {
        // 기록이 있으므로 deductionsPrice의 기록을 수정합니다.
        // map[17] a.k.a teacherID
        process.env.DEBUG === '1' && console.log(`${map[17]}: 이미 기록이 있습니다.`);
        await conn.query(editProceedsQuery, map);
      }
      else if(RegCode === 0) {
        // 기록이 없으므로 deductionsPrice에 등록합니다.
        process.env.DEBUG === '1' && console.log(`${map[17]}: 기록이 없습니다.`);
        await conn.query(addProceedsQuery, map);
      }
      else {
        process.env.DEBUG === '1' && console.log(`${map[17]}: 존재하지 않는 ID.`);
      }
    }));
    for(const insertFunction of insertFunctions) {
      await insertFunction();
    }
    const [ deductionsStatus ] = await conn.query(checkDeductionsRegQuery, [
      lessonMonth
    ]);
    if(deductionsStatus.RegCode === 1) {
      await conn.query(editDeductionsQuery, [ lessonMonth ]);
    }
    else if(deductionsStatus.RegCode === 0) {
      await conn.query(addDeductionsQuery, [ lessonMonth ]);
    }
    else {
      throw new Error('Query Error.');
    }
    await conn.commit();
  } catch(err) {
    process.env.ERROR === '1' && console.error(err);
    await conn.rollback();
  }
  conn && conn.release();
}


module.exports = async (
  req, res
) => {
  //PUT
  const lessonMonth = req.params?.lessonMonth;
  const deductions = {
    NP: 0.045, // 사대보험세율
    HI: 0.0343, // 건강보험세율
    LCI: 0.1152, // 장기요양보험세율
    EI: 0.008, // 고용보험세율
    EIC: 0.0105, // 고용보험회사세율
    LIT: 0.1 // 지방소득세율
  };
  const teachers = req.body?.teachers ?? [];
  try {
    const result = await addProceeds(
      lessonMonth, teachers, deductions
    );
    OK(res, result);
  } catch(err) {
    BadRequest(res, err);
  }
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
    teacherID: 1236,
    basic: 2000000,
    taxable: 0
  }, {
    teacherID: 1234,
    basic: 1800000,
    taxable: 1200000
  }, {
    teacherID: 1231,
    basic: 1800000,
    taxable: 1200000
  }, {
    teacherID: 1246,
    basic: 1800000,
    taxable: 1200000
  }];
  await addProceeds(lessonMonth, teachers, deductions);
  pool.end();
})();
