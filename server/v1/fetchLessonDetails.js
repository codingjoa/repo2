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
  ) as groupStudents
from lesson
where
  quarterID=? and
  lessonMonth=?
`);
const getLessonStudents = (
`select
  studentInfo.studentID,
  studentInfo.studentBirthday,
  studentInfo.studentName
from
  studentInfo,
  billing
where
  billing.studentID=studentInfo.studentID and
  billing.quarterID=? and
  date_format(?, '%Y-%m')=date_format(billing.lessonMonth, '%Y-%m')
`);
const getLessonStudies = (
`select 
  studySize,
  studyWeek,
  studyProgressed
from
  (select
    lessonMonth,
    quarterID,
    count(studyWeek) as studySize
  from
    study
  group by
    lessonMonth,
    quarterID
  ) as a,
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
    study.studyWeek desc
  limit
    100
  ) as b
where
  a.lessonMonth=b.lessonMonth and
  a.quarterID=b.quarterID and
  date_format(?, '%Y-%m')=date_format(a.lessonMonth, '%Y-%m') and
  ?=a.quarterID
`);

/* @codingjoa
   해당 레슨 하위 정보 조회
*/

async function fetchLessonDetails(quarterID, lessonMonth) {
  const general = await pool.query(getLessonGeneral,
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
    studySize: studies.length,
    studies: studies.map(({
      studyWeek,
      studyProgressed
    })=>({
      studyWeek,
      studyProgressed
    }))
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
module.id === require.main.id && (() => {
  setTimeout(() => (

  execAsync(fetchLessonDetails, (err, ok) => {
    err && console.error(err);
    ok && console.log(ok);
    end();
  })(17, '2020-10-01')), 3000);
})();
