const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');
const execAsync = require('../execAsync');
const fetchProceeds = (
`select
  slesson.*,
  clesson.endedLesson,
  clesson.totalLesson
from
(select
  teacherID,
  lesson.lessonMonth,
  (select
    teacherName
  from
    teacher
  where
    teacher.teacherID=lesson.teacherID
  ) as teacherName,
  (select
    teacherAccount
  from
    teacher
  where
    teacher.teacherID=lesson.teacherID
  ) as teacherAccount,
  count(lesson.teacherID) as totalStudent,
  sum(billingPrice) as totalPrice,
  case
    when sum(billingPrice*(refundPercent*0.01)) is null
    then 0
    else sum(billingPrice*(refundPercent*0.01))
  end as totalRefundPrice
from
  lesson,
  billing left join refund
on
  billing.studentID=refund.studentID and
  billing.quarterID=refund.quarterID and
  billing.lessonMonth=refund.lessonMonth
where
  lesson.quarterID=billing.quarterID and
  lesson.lessonMonth=billing.lessonMonth
group by
  teacherID,
  lessonMonth
) as slesson,
(select
  teacherID,
  lessonMonth,
  sum(lessonEnded) as endedLesson,
  count(lessonEnded) as totalLesson
from
  lesson
group by
  teacherID,
  lessonMonth
) as clesson
where
  clesson.teacherID=slesson.teacherID and
  clesson.lessonMonth=slesson.lessonMonth and
  date_format(?, '%Y-%m')=date_format(clesson.lessonMonth, '%Y-%m')`);
const fetchLessons = (
`select
  lessonMonth
from
  lesson
where
  lessonMonth
  between concat(date_format(?, '%Y-%m'), '-01') and
    concat(date_format(?, '%Y-%m'), '-01')
group by
  lessonMonth asc`);


// 실험중인 쿼리
const fetchProceedsMonths = (
`select
  slesson.teacherID,
  slesson.lessonMonth,
  slesson.teacherName,
  slesson.teacherAccount,
  min(slesson.lessonMonth) as firstLessonMonth,
  max(slesson.lessonMonth) as lastLessonMonth,
  count(slesson.lessonMonth) as months,
  clesson.endedLesson,
  sum(clesson.totalLesson) as totalLesson,
  sum(slesson.totalStudent) as totalStudent,
  sum(slesson.totalPrice) as totalPrice,
  sum(slesson.totalRefundPrice) as totalRefundPrice,
  sum(
    case when slesson.totalPrice-slesson.totalRefundPrice > 2000000 then slesson.totalPrice-slesson.totalRefundPrice else 2000000 end) as totalProceed,
  sum(
    case when slesson.totalPrice-slesson.totalRefundPrice-totalProceed>0 then (slesson.totalPrice-slesson.totalRefundPrice-totalProceed) * 0.09 else 0 end) as toLedger
from
(select
  teacherID,
  lesson.lessonMonth,
  (select
    teacherName
  from
    teacher
  where
    teacher.teacherID=lesson.teacherID
  ) as teacherName,
  (select
    teacherAccount
  from
    teacher
  where
    teacher.teacherID=lesson.teacherID
  ) as teacherAccount,
  count(lesson.teacherID) as totalStudent,
  sum(billingPrice) as totalPrice,
  sum(billingPrice*(refundPercent*0.01)) as totalRefundPrice
from
  lesson,
  billing left join refund
on
  billing.studentID=refund.studentID and
  billing.quarterID=refund.quarterID and
  billing.lessonMonth=refund.lessonMonth
where
  lesson.quarterID=billing.quarterID and
  lesson.lessonMonth=billing.lessonMonth
group by
  teacherID,
  lessonMonth
) as slesson,
(select
  teacherID,
  lessonMonth,
  sum(lessonEnded) as endedLesson,
  count(lessonEnded) as totalLesson
from
  lesson
group by
  teacherID,
  lessonMonth
) as clesson
where
  clesson.teacherID=slesson.teacherID and
  clesson.lessonMonth=slesson.lessonMonth and
  clesson.lessonMonth
  between concat(date_format(?, '%Y-%m'), '-01') and
    concat(date_format(?, '%Y-%m'), '-01')
group by
  clesson.teacherID asc
`);
const fetchProceedsMonthsC = (
`select
  *,
  min(k.lessonMonth) as firstLessonMonth,
  max(k.lessonMonth) as lastLessonMonth,
  sum(k.months*s.salary) as toTax,
  sum(k.totalPrice-k.totalRefundPrice-k.totalProceed-s.salary) as toCompany,
  sum(
    case when k.totalPrice-k.totalRefundPrice-k.totalProceed>0 then (k.totalPrice-k.totalRefundPrice-k.totalProceed) * 0.09 else 0 end) as toLedger
from
  (select
    slesson.teacherID,
    slesson.lessonMonth,
    slesson.teacherName,
    slesson.teacherAccount,
    count(slesson.lessonMonth) as months,
    clesson.endedLesson,
    sum(clesson.totalLesson) as totalLesson,
    sum(slesson.totalStudent) as totalStudent,
    sum(slesson.totalPrice) as totalPrice,
    sum(slesson.totalRefundPrice) as totalRefundPrice2,
    case when slesson.totalRefundPrice is null then 0 else slesson.totalRefundPrice end as totalRefundPrice,
    sum(
      case when slesson.totalPrice-slesson.totalRefundPrice > 2000000 then slesson.totalPrice-slesson.totalRefundPrice else 2000000 end) as totalProceed
  from
  (select
    teacherID,
    lesson.lessonMonth,
    (select
      teacherName
    from
      teacher
    where
      teacher.teacherID=lesson.teacherID
    ) as teacherName,
    (select
      teacherAccount
    from
      teacher
    where
      teacher.teacherID=lesson.teacherID
    ) as teacherAccount,
    count(lesson.teacherID) as totalStudent,
    sum(billingPrice) as totalPrice,
    sum(billingPrice*(refundPercent*0.01)) as totalRefundPrice
  from
    lesson,
    billing left join refund
  on
    billing.studentID=refund.studentID and
    billing.quarterID=refund.quarterID and
    billing.lessonMonth=refund.lessonMonth
  where
    lesson.quarterID=billing.quarterID and
    lesson.lessonMonth=billing.lessonMonth
  group by
    teacherID,
    lessonMonth
  ) as slesson,
  (select
    teacherID,
    lessonMonth,
    sum(lessonEnded) as endedLesson,
    count(lessonEnded) as totalLesson
  from
    lesson
  group by
    teacherID,
    lessonMonth
  ) as clesson
  where
    clesson.teacherID=slesson.teacherID and
    clesson.lessonMonth=slesson.lessonMonth and
    clesson.lessonMonth
    between concat(date_format(?, '%Y-%m'), '-01') and
      concat(date_format(?, '%Y-%m'), '-01')
  group by
    clesson.teacherID asc,
    clesson.lessonMonth asc
  ) as k,
  (select
    ? * 0.045 as salary
  ) as s
group by
  k.teacherID asc 
`);




/* @codingjoa
   요청한 달의 선생 수익금 계산
   조건1. 요청한 달만
*/

/*
기본급: (salary-사대보험부담금)*선생.months,
      수당: (선생.분배할돈-salary*선생.months) * 0.967,
      소득세: (선생.분배할돈-salary*선생.months) * 0.033,
      선생부담사대보험료: 사대보험부담금*선생.months
*/


function calculator(
  teacherList,
  salary,
  origin = null
) {
  const 사대보험부담금 = salary * 0.045;
  const 정산됨 = teacherList.map(선생 => ({
    ...선생,
    수업월수: 1,
    걷은수업료: 선생.totalPrice,
    환불해준수업료: 선생.totalRefundPrice,
    남은수업료: (선생.totalPrice-선생.totalRefundPrice),
  }))
  .map(선생 => ({
    ...선생,
    기본급충당가능여부: (선생.남은수업료*0.3>=2000000) ? true: false
  }))
  .map(선생 => ({
    ...선생,
    분배할돈: 선생.기본급충당가능여부 ? 선생.남은수업료*0.3 : 2000000
  }))
  .map(선생 => ({
    ...선생,
    선생돈: {
      기본급: (salary-사대보험부담금),
      수당: (선생.분배할돈-salary) * 0.967,
      소득세: (선생.분배할돈-salary) * 0.033,
      선생부담사대보험료: 사대보험부담금
    },
    회사돈: 선생.남은수업료-선생.분배할돈
    //수당의 3.3%
  }))
  .map(선생 => ({
    ...선생,
    선생돈: {
      ...선생.선생돈,
      실수령액: 선생.선생돈.기본급 + 선생.선생돈.수당
    }
  }));
  const canbeClosedLesson = 정산됨.reduce((a, b) =>
    a + b.totalLesson - b.endedLesson,
    0
  ) + ( origin!==null ? origin.canbeClosedLesson : 0 );
  const 수업료합계 = 정산됨.reduce((a, b) =>
    a + b.걷은수업료,
    0
  ) + ( origin!==null ? origin.tax?.수업료합계 : 0);
  const 수업료환불합계 = 정산됨.reduce((a, b) =>
    a + b.환불해준수업료,
    0
  ) + ( origin!==null ? origin.tax?.수업료환불합계 : 0);
  const 선생님월급 = 정산됨.reduce((a, b) =>
    a + b.선생돈.실수령액,
    0
  ) + ( origin!==null ? origin.tax?.선생님월급 : 0);
  const 선생님소득세 = 정산됨.reduce((a, b) =>
    a + b.선생돈.소득세,
    0
  ) + ( origin!==null ? origin.tax?.선생님소득세 : 0);
  const 사대보험료 = (사대보험부담금 * teacherList.length);
  const 원장지급전 = 정산됨.reduce((a, b) =>
    a + b.회사돈,
    0
  ) - 사대보험료;
  const 원장님월급 = (원장지급전>0 ?
    (원장지급전 * 0.09) :
    0
  ) + ( origin!==null ? origin.tax?.원장님월급 : 0);
  const 손익금 = (원장지급전 - 원장님월급) + ( origin ? origin.tax.손익금 : 0);
  const proceeds = (origin===null) ? new Map(정산됨.map(({
    teacherID,
    teacherName,
    teacherAccount,
    totalStudent,
    totalPrice,
    totalRefundPrice,
    endedLesson,
    totalLesson,
    수업월수,
    걷은수업료,
    환불해준수업료,
    남은수업료,
    분배할돈,
    선생돈,
    회사돈
  }) => ([
    teacherID,
    { teacherID,
      teacherName,
      teacherAccount,
      totalStudent,
      totalPrice,
      totalRefundPrice,
      endedLesson,
      totalLesson,
      수업월수,
      걷은수업료,
      환불해준수업료,
      남은수업료,
      분배할돈,
      선생돈,
      회사돈
    }
  ]))) : (() => {
    for(const {
      teacherID,
      teacherName,
      teacherAccount,
      totalStudent,
      totalPrice,
      totalRefundPrice,
      endedLesson,
      totalLesson,
      수업월수,
      걷은수업료,
      환불해준수업료,
      남은수업료,
      분배할돈,
      선생돈,
      회사돈
    } of 정산됨) {
      if(!origin.proceeds.has(teacherID)) {
        origin.proceeds.set(teacherID, {
          teacherName,
          teacherAccount,
          totalStudent,
          totalPrice,
          totalRefundPrice,
          endedLesson,
          totalLesson,
          수업월수,
          걷은수업료,
          환불해준수업료,
          남은수업료,
          분배할돈,
          선생돈,
          회사돈
        });
        continue;
      }
      const t = origin.proceeds.get(teacherID);
      t.totalStudent += totalStudent;
      t.totalPrice += totalPrice;
      t.totalRefundPrice += totalRefundPrice;
      t.endedLesson += endedLesson;
      t.totalLesson += totalLesson;
      t.수업월수 += 수업월수;
      t.걷은수업료 += 걷은수업료;
      t.환불해준수업료 += 환불해준수업료;
      t.남은수업료 += 남은수업료;
      t.분배할돈 += 분배할돈;
      t.선생돈.기본급 += 선생돈.기본급;
      t.선생돈.수당 += 선생돈.수당;
      t.선생돈.소득세 += 선생돈.소득세;
      t.선생돈.선생부담사대보험료 += 선생돈.선생부담사대보험료;
      t.선생돈.실수령액 += 선생돈.실수령액;
      t.회사돈 += 회사돈;
    }
    return origin.proceeds;
  })();

  return ({
    proceeds,
    tax: {
      수업료합계,
      수업료환불합계,
      선생님월급,
      선생님소득세,
      선생님4대보험료: 사대보험료 + (origin!==null ? origin.tax?.선생님4대보험료 : 0),
      회사부담4대보험료: 사대보험료 + (origin!==null ? origin.tax?.회사부담4대보험료 : 0),
      원장님월급,
      손익금
    },
    canbeClosedLesson
  });
}
async function* fetchs(
  conn,
  FM,
  LM
) {
  let d, i = 0;
  const months = await conn.query(fetchLessons, [ FM, LM ]);
  if(!months.length) {
    return;
  }
  yield;
  while(i < months.length) {
    d = await conn.query(fetchProceeds, [ months[i++].lessonMonth ]);
    yield d;
  }
  return;
}

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth ?? '2020-10-01';
  const lastMonth = req.params?.lastMonth ?? lessonMonth;
  const salary = req.query?.salary ?? 1800000;
  const conn = await pool.getConnection();
  let result = null;
  try {
    const f = fetchs(conn, lessonMonth, lastMonth);
    if(!(await f.next()).done) {
      for await (const a of f) {
        result = calculator(a, salary, result);
      }
      result.startMonth = lessonMonth;
      result.endMonth = lastMonth;
      result.proceeds = Array.from(result.proceeds.values());
      OK(res, result);
    } else {
      NotFound(res);
    }
  } catch(err) {
    BadRequest(res, err);
    console.error(err);
  }
  conn.release();
};
module.id === require.main.id && (async () => {
  const lessonMonth = process.env.FM ?? '2020-10-01';
  const lastMonth = process.env.LM ?? '2021-10-01';
  const salary = 1800000;
  const conn = await pool.getConnection();
  let result = null;
  try {
    const f = fetchs(conn, lessonMonth, lastMonth);
    if(!(await f.next()).done) {
      for await (const a of f) {
        result = calculator(a, salary, result);
      }
      result.startMonth = lessonMonth;
      result.endMonth = lastMonth;
      result.proceeds = Array.from(result.proceeds.values());
      console.log(JSON.stringify(result));
    } else {
      console.log('not found');
    }
  } catch(err) {
    console.error(err);
  }
  conn.release();
  pool.end();
})();
