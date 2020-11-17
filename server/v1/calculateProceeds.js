const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   요청한 달의 선생 수익금 계산
   조건1. 요청한 달만
*/
function calculator(teacherList, salary) {
  const 사대보험부담금 = salary * 0.045;
  const 정산됨 = teacherList.map(선생 => ({
    ...선생,
    걷은수업료: 선생.totalPrice,
    환불해준수업료: 선생.totalRefundPrice,
    남은수업료: (선생.totalPrice-선생.totalRefundPrice)
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
      기본급: salary-사대보험부담금,
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
  );
  const 수업료합계 = 정산됨.reduce((a, b) =>
    a + b.걷은수업료,
    0
  );
  const 수업료환불합계 = 정산됨.reduce((a, b) =>
    a + b.환불해준수업료,
    0
  );
  const 선생님월급 = 정산됨.reduce((a, b) =>
    a + b.선생돈.실수령액,
    0
  );
  const 선생님소득세 = 정산됨.reduce((a, b) =>
    a + b.선생돈.소득세,
    0
  );
  const 사대보험료 = (사대보험부담금 * teacherList.length);
  const 원장지급전 = 정산됨.reduce((a, b) =>
    a + b.회사돈,
    0
  ) - 사대보험료;
  const 원장님월급 = 원장지급전>0 ? (원장지급전 * 0.09): 0;
  const 손익금 = 원장지급전 - 원장님월급;
  return ({
    proceeds: 정산됨,
    tax: {
      수업료합계,
      수업료환불합계,
      선생님월급,
      선생님소득세,
      선생님4대보험료: 사대보험료,
      회사부담4대보험료: 사대보험료,
      원장님월급,
      손익금
    },
    canbeClosedLesson
  });
}

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth ?? '2020-10-01';
  const salary = req.query?.salary ?? 1800000;
  pool.query(
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
  date_format(?, '%Y-%m')=date_format(clesson.lessonMonth, '%Y-%m')`,
    [ lessonMonth ]
  )
  .then(r => {
    if(!r.length) {
      NotFound(res);
      return;
    }
    const calculated = calculator(r, salary);
    process.env.DEV && console.log(calculated);
    res && OK(res, calculated);
  })
  .catch(e => BadRequest(res, e));
};

//process.env.DEV && module.exports({});
