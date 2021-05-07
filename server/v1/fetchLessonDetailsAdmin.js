const { OK, BadRequest, NotFound } = require('../format');
const { pool, end } = require('../poolManager');
const execAsync = require('../execAsync');

const getLessonGeneralJoin = (
`select
  quarter.quarterID,
  quarter.quarterName,
  teacher.teacherID,
  lesson.lessonMonth,
  lesson.lessonCreatedAt,
  lesson.lessonEndedAt,
  lesson.lessonEnded,
  count(
    distinct (case
      when billing.billingGroup=0
      then billing.studentID
      else null
    end)
  ) as singleStudents,
  count(
    distinct (case
      when billing.billingGroup>0
      then billing.studentID
      else null
    end)
  ) as groupStudents,
  sum(
    billing.billingPrice
  ) as totalPrice,
  A.studySize
from
  lesson left join
  quarter on
    quarter.quarterID=lesson.quarterID left join
  teacher on
    teacher.teacherID=lesson.teacherID left join
  billing on
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth left join
  (select
    quarterID,
    lessonMonth,
    count(*) as studySize
  from
    study
  group by
    quarterID,
    lessonMonth
  ) as A on
    A.quarterID=lesson.quarterID and
    A.lessonMonth=lesson.lessonMonth
where
  ?=lesson.quarterID and
  date_format(?, '%Y-%m')=date_format(lesson.lessonMonth, '%Y-%m')`);
const getLessonChecking = (
`select
  a.studentID,
  a.studentNameDup,
  a.billingPrice,
  a.billingPayment,
  a.billingGroup,
  a.billingScholarshipCode,
  a.billingTaxCode,
  a.billingRefundReason,
  a.billingRefundPrice,
  b.json
from
  (select
    quarterID,
    lessonMonth,
    studentID,
    (select
      case
        when Duplicated.isDuplicatedName=1
        then concat(studentInfo.studentName, '(', right(trim(replace(studentInfo.studentPhone, '-', '')), 4), ')')
        else studentInfo.studentName
      end as studentNameDup
    from
      studentInfo left join
      (select
        studentInfo.studentName,
        1 as isDuplicatedName
      from
        studentInfo
      group by
        studentInfo.studentName
      having
        count(studentInfo.studentName) > 1
      ) as Duplicated on
        studentInfo.studentName=Duplicated.studentName
    where
      studentInfo.studentID=billing.studentID
    ) as studentNameDup,
    billingPrice,
    billingPayment,
    billingGroup,
    billingScholarshipCode,
    billingTaxCode,
    billingRefundReason,
    billingRefundPrice
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
  const general = await pool.query(getLessonGeneralJoin,
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
