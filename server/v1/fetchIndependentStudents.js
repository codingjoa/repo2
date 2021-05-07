const { OK, NotFound, InternalError } = require('../format');
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
  Q.studentName,
  Q.studentNameDup
from
  (select
    studentInfo.studentID,
    studentInfo.studentName,
    case
      when Duplicated.isDuplicatedName=1
      then concat(studentInfo.studentName, '(', right(trim(replace(studentInfo.studentPhone, '-', '')), 4), ')')
      else studentInfo.studentName
    end as studentNameDup,
    max(studentInfo.quarterID is null and ifnull(billing.billingRetractable, 0)=0 and ifnull(lesson.lessonEnded, 1)=1) as isCanBePosted
  from
    studentID left join
    studentInfo on
      studentID.studentID=studentInfo.studentID left join
    (select
      studentInfo.studentName,
      count(studentInfo.studentName) > 1 as isDuplicatedName
    from
      studentInfo
    group by
      studentInfo.studentName
    ) as Duplicated on
      studentInfo.studentName=Duplicated.studentName left join
    billing on
      studentID.studentID=billing.studentID left join
    lesson on
      billing.quarterID=lesson.quarterID and
      billing.lessonMonth=lesson.lessonMonth
  where
    studentID.unused=0
  group by
    studentID.studentID) as Q
where
  Q.isCanBePosted=1
limit ?, ?`);
const fetchIndependentStudentsLenQuery = (
`select
  count(*) as total
from
  (select
    studentInfo.studentID,
    studentInfo.studentName,
    case
      when Duplicated.isDuplicatedName=1
      then concat(studentInfo.studentName, '(', right(trim(replace(studentInfo.studentPhone, '-', '')), 4), ')')
      else studentInfo.studentName
    end as studentNameDup,
    max(studentInfo.quarterID is null and ifnull(billing.billingRetractable, 0)=0 and ifnull(lesson.lessonEnded, 1)=1) as isCanBePosted
  from
    studentID left join
    studentInfo on
      studentID.studentID=studentInfo.studentID left join
    (select
      studentInfo.studentName,
      count(studentInfo.studentName) > 1 as isDuplicatedName
    from
      studentInfo
    group by
      studentInfo.studentName
    ) as Duplicated on
      studentInfo.studentName=Duplicated.studentName left join
    billing on
      studentID.studentID=billing.studentID left join
    lesson on
      billing.quarterID=lesson.quarterID and
      billing.lessonMonth=lesson.lessonMonth
  where
    studentID.unused=0
  group by
    studentID.studentID) as Q
where
  Q.isCanBePosted=1`);

module.exports = async function(
  req, res
) {
  const offset = req.query.offset - 0 ?? 0; // 1.5 or later
  const limit = req.query.size - 0 ?? 10; // 1.5 or later
  const conn = await pool.getConnection();
  try {
    const info = await conn.query(fetchIndependentStudentsLenQuery);
    if(!info?.length) {
      NotFound(res);
    }
    const total = info[0].total;
    const totalPage = Math.ceil(total / limit);
    const rows = await conn.query(fetchIndependentStudentsQuery, [
      offset, limit
    ]);
    if(rows.length === 0) {
      NotFound(res);
    } else {
      OK(res, {
        total,
        totalPage,
        rows
      });
    }
    conn.release();
  } catch(err) {
    conn.release();
    InternalError(res);
  }

};

module.id === require.main.id && (async () => {
  await pool.query(fetchIndependentStudentsQuery)
  .then(console.log, console.error);
  pool.end();
})();
