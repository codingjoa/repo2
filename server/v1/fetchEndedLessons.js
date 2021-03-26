const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   마감된 출석부 목록
*/
const fetchEndedLessons = (
`select
  quarterID,
  (select
    quarterName
  from quarter
  where
    quarter.quarterID=lesson.quarterID
  ) as quarterName,
  lessonMonth,
  (select
    teacherName
  from teacher
  where
    teacher.teacherID=lesson.teacherID
  ) as teacherName,
  (select count(*)
  from billing
  where
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth and
    billingGroup=0
  ) as singleStudents,
  (select count(*)
  from billing
  where
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth and
    billingGroup>0
  ) as groupStudents,
  (select
    count(studyWeek) as studySize
  from
    study
  where
    study.quarterID=lesson.quarterID and
    study.lessonMonth=lesson.lessonMonth
  ) as studySize,
  (select
    sum(billingPrice)
  from
    billing
  where
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth and
    0=billing.billingRetractable
  ) as totalPrice,
  (select
    sum(billingPrice*(refundPercent*0.01))
  from
    billing, refund
  where
    refund.studentID=billing.studentID and
    refund.quarterID=billing.quarterID and
    refund.lessonMonth=billing.lessonMonth and
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth and
    0=billing.billingRetractable
  ) as totalRefundPrice
from
  lesson
where
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and
  lessonEnded=1 order by quarterID`);

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth ?? null;
  pool.query(fetchEndedLessons,
    [ lessonMonth ]
  )
  .then(r => {
    r.length > 0 ? OK(res, r) : NotFound(res);
  })
  .catch(e => BadRequest(res, e));
};
