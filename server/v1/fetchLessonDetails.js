const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');
const execAsync = require('../execAsync');

const getLessonGeneralJoin = (
`select
  quarter.quarterID,
  quarter.quarterName,
  teacher.teacherID,
  lesson.lessonMonth,
  lesson.lessonCreatedAt,
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
  A.studySize,
  A.studyOkSize
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
    study.quarterID,
    study.lessonMonth,
    count(distinct study.studyWeek) as studySize,
    count(distinct case
      when checking.checkModified is not null
      then checking.studyWeek
      else null
    end) as studyOkSize
  from
    study left join
    checking on
      study.quarterID=checking.quarterID and
      study.lessonMonth=checking.lessonMonth
  group by
    study.quarterID,
    study.lessonMonth
  ) as A on
    A.quarterID=lesson.quarterID and
    A.lessonMonth=lesson.lessonMonth
where
  ?=lesson.quarterID and
  date_format(?, '%Y-%m')=date_format(lesson.lessonMonth, '%Y-%m')`);
const getLessonGeneral = (
`select
  quarterID,
  (select quarterName
  from quarter
  where quarter.quarterID=lesson.quarterID
  ) as quarterName,
  (select teacherID
  from teacher
  where teacher.teacherID=lesson.teacherID
  ) as teacherID,
  lessonMonth,
  lessonCreatedAt,
  lessonEnded,
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
  quarterID=? and
  lessonMonth=?
`);
const getLessonStudents = (
`select
  studentInfo.studentID,
  studentInfo.studentBirthday,
  studentInfo.studentName,
  case
    when Duplicated.isDuplicatedName=1
    then concat(studentInfo.studentName, '(', right(trim(replace(studentInfo.studentPhone, '-', '')), 4), ')')
    else studentInfo.studentName
  end as studentNameDup,
  billing.billingPrice,
  billing.billingScholarshipCode,
  billing.billingTaxCode
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
    studentInfo.studentName=Duplicated.studentName left join
  billing on
    billing.studentID=studentInfo.studentID
where
  billing.quarterID=? and
  date_format(?, '%Y-%m')=date_format(billing.lessonMonth, '%Y-%m')
order by
  studentInfo.studentName asc`);
/*
const getLessonStudiesJoin = (
`select
  studyWeek,
  studyProgressed
from
  study left join
  checking on
    study.quarterID=checking.quarterID and
    study.lessonMonth=checking.lessonMonth and
    study.studyWeek=checking.studyWeek
order by
group by
  `
);
*/
const getLessonStudies = (
`select
  studyWeek,
  studyProgressed
from
  (select
    study.lessonMonth,
    study.quarterID,
    study.studyWeek,
    case when count(checkModified)>0 then 1 else 0 end as studyProgressed
  from
    study, checking
  where
    study.lessonMonth=checking.lessonMonth and
    study.quarterID=checking.quarterID and
    study.studyWeek=checking.studyWeek
  group by
    study.studyWeek,
    study.lessonMonth,
    study.quarterID
  order by
    study.studyWeek asc
  ) as b
where
  date_format(?, '%Y-%m')=date_format(b.lessonMonth, '%Y-%m') and
  ?=b.quarterID
`);

/* @codingjoa
   해당 레슨 하위 정보 조회
*/

async function fetchLessonDetails(quarterID, lessonMonth) {
  const general = await pool.query(getLessonGeneralJoin,
    [ quarterID,
      lessonMonth
    ]
  )
  .then(r => r.length ? r[0] : undefined);
  if(!general) {
    return null;
  }
  const students = await pool.query(getLessonStudents,
    [ quarterID,
      lessonMonth
    ]
  ).then(r => r.length ? r : undefined);
  const studies = await pool.query(getLessonStudies,
    [ lessonMonth,
      quarterID
    ]
  ).then(r => r.length ? r : {});

  return {
    ...general,
    students,
    studies
  };
}

module.exports = function(
  req, res
) {
  const quarterID = req.params?.quarterID ?? null;
  const lessonMonth = req.params?.lessonMonth ?? null;
  execAsync(fetchLessonDetails, (err, ok) => {
    if(err) {
      BadRequest(res, err);
      return;
    }
    ok === null && NotFound(res);
    ok !== null && OK(res, ok)
  })(quarterID, lessonMonth);
};
module.id === require.main.id && (async () => {
  const quarterID = process.env.QID ?? 6;
  const lessonMonth = process.env.LM ?? '2020-10-01';
  let result = null;
  if(process.env.V1 === '1') {
    result = await fetchLessonDetails(quarterID, lessonMonth).catch(console.error);
  }
  else {
    result = await pool.query(getLessonGeneralJoin, [
      quarterID,
      lessonMonth
    ]).catch(console.error);
  }
  console.log(result);
  pool.end();
})();
