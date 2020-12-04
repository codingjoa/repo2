const { OK, BadRequest, NotFound } = require('../format');
const { pool, end } = require('../poolManager');
const execAsync = require('../execAsync');

const getLessonGeneral = (
`select
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
  ) as groupStudents,
  (select
    count(studyWeek) as studySize
  from
    study
  where
    study.quarterID=lesson.quarterID and
    study.lessonMonth=lesson.lessonMonth
  ) as studySize
from lesson
where
  ?=quarterID and
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')`
);
const getLessonChecking = (
`select
  a.studentID,
  a.studentName,
  a.studentBirthday,
  a.billingPrice,
  a.billingPayment,
  a.billingGroup,
  a.refundReason,
  b.json
from
  (select
    quarterID,
    lessonMonth,
    studentID,
    (select studentName
    from studentInfo
    where studentInfo.studentID=billing.studentID
    ) as studentName,
    (select studentBirthday
    from studentInfo
    where studentInfo.studentID=billing.studentID
    ) as studentBirthday,
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
  ) as a,
  (select
    quarterID,
    lessonMonth,
    studentID,
    concat('{', group_concat(concat('"', studyWeek, '": ', checkOk)), '}') as json
  from
    checking
  group by
    studentID,
    quarterID,
    lessonMonth
  ) as b
where
  a.studentID=b.studentID and
  a.quarterID=b.quarterID and
  a.lessonMonth=b.lessonMonth and
  ?=b.quarterID and
  date_format(?, '%Y-%m')=date_format(b.lessonMonth, '%Y-%m')
order by
  a.studentID asc`
);

async function fetchLessonDetailsAdmin(
  quarterID,
  lessonMonth
) {
  const general = await pool.query(getLessonGeneral,
    [ quarterID,
      lessonMonth
    ]
  )
  .then(r => r.length ? r[0] : undefined);
  if(!general) {
    return null;
  }
  const checking = await pool.query(getLessonChecking,
    [ quarterID,
      lessonMonth
    ]
  ).then(r => r.length ? r : undefined);
  general.students = checking && checking.map(({
    json,
    ...rest
  }) => ({
    ...rest,
    checkOks: JSON.parse(json)
  }));
  return general;
}

module.exports = function(
  req, res
) {
  const quarterID = req.params?.quarterID ?? null;
  const lessonMonth = req.params?.lessonMonth ?? null;
  execAsync(fetchLessonDetailsAdmin, (err, result) => {
    if(err) {
      BadRequest(res, err);
      return;
    }
    if(result === null) {
      NotFound(res);
      return;
    }
    OK(res, result);
  })(quarterID, lessonMonth);
};
module.id === require.main.id && (() => {
  execAsync(fetchLessonDetailsAdmin, (err, result) => {
    if(err) console.error(err);
    else console.log(result);
    end();
  })(5, '2020-10-01')/*(27, '2020-11-01')*/;
})();
