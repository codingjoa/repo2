const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  const general = await pool.query(`
select
  quarterID,
  (select quarterName
  from quarter
  where quarter.quarterID=lesson.quarterID
  ) as quarterName,
  (select teacherName
  from teacher
  where teacher.teacherID=lesson.teacherID
  ) as teacherName,
  lessonMonth,
  lessonEnded,
  lessonCreatedAt,
  lessonEndedAt,
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
  ) as groupStudents
from lesson
where
  quarterID=? and
  lessonMonth=?`,
    [ quarterID ?? null,
      lessonMonth ?? null
    ]
  )
  .then(r => r.length ? r[0] : undefined)
  .catch(e => BadRequest(res, e));
  if(!general) {
    NotFound(res);
    return;
  }
  const checking = await pool.query(`
select
  studentID,
  (select studentName
  from studentInfo
  where studentInfo.studentID=billing.studentID
  ) as studentName,
  (select studentBirthday
  from studentInfo
  where studentInfo.studentID=billing.studentID
  ) as studentBirthday,
  (select checkOK
  from checking
  where
    checking.studentID=billing.studentID and
    checking.quarterID=billing.quarterID and
    checking.lessonMonth=billing.lessonMonth and
    checking.studyWeek=1
  ) as week1,
  (select checkOK
  from checking
  where
    checking.studentID=billing.studentID and
    checking.quarterID=billing.quarterID and
    checking.lessonMonth=billing.lessonMonth and
    checking.studyWeek=2
  ) as week2,
  (select checkOK
  from checking
  where
    checking.studentID=billing.studentID and
    checking.quarterID=billing.quarterID and
    checking.lessonMonth=billing.lessonMonth and
    checking.studyWeek=3
  ) as week3,
  (select checkOK
  from checking
  where
    checking.studentID=billing.studentID and
    checking.quarterID=billing.quarterID and
    checking.lessonMonth=billing.lessonMonth and
    checking.studyWeek=4
  ) as week4,
  billingPrice,
  billingPayment,
  billingGroup,
  (select
    refundReason
  from refund
  where
    refund.quarterID=billing.quarterID and
    refund.lessonMonth=billing.lessonMonth and
    refund.studentID=billing.studentID
  ) as refundReason
from billing
where
  ?=quarterID and
  date_format(?, '%Y-%m')=date_format(billing.lessonMonth, '%Y-%m')`,
    [ quarterID ?? null,
      lessonMonth ?? null
    ]
  ).then(r => r.length ? r : undefined)
  .catch(e => BadRequest(res, e));
  OK(res, {
    general, checking
  });
};
