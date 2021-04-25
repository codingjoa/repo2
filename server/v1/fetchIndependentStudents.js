const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');
const fetchStudentsQuery = (
`select
  studentInfo.*,
  studentID.studentCreated,
  case
    when count(case
      when billing.billingRetractable=1
      then 1
      else null
    end)=0 and count(case
      when lesson.lessonEnded=0
      then 1
      else null
    end)=0
    then 1
    else 0
  end as isCanBeClosed
from
  studentID left join
  studentInfo on
    studentID.studentID=studentInfo.studentID left join
  billing on
    studentInfo.studentID=billing.studentID left join
  lesson on
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth
where
  studentID.unused=0
group by
  studentID.studentID`);
const fetchIndependentStudentsQuery = (
`select
  Q.studentID,
  Q.studentName
from
  (select
    distinct studentInfo.studentID,
    studentInfo.studentName,
    studentInfo.quarterID
  from
    studentID left join
    studentInfo on
      studentID.studentID=studentInfo.studentID left join
    billing on
      studentInfo.studentID=billing.studentID left join
    lesson on
      billing.quarterID=lesson.quarterID and
      billing.lessonMonth=lesson.lessonMonth
  where
    studentID.unused=0 and
    ((billing.billingRetractable=0 and lesson.lessonEnded=1) or billing.billingRetractable is null)
  group by
    studentID.studentID) as Q
where
  Q.quarterID is null`);

module.exports = async function(
  req, res
) {
  pool.query(fetchIndependentStudentsQuery)
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};

module.id === require.main.id && (async () => {
  await pool.query(fetchIndependentStudentsQuery)
  .then(console.log, console.error);
  pool.end();
})();
