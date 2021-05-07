const { OK, NotFound, InternalError } = require('../format');
const { pool } = require('../poolManager');
const { getInfo } = require('../sessionMapManager');
const fetchStudentsQuery = (
`select
  studentInfo.*,
  quarter.quarterName,
  billing.quarterNameLesson,
  studentID.studentCreated,
  case
    when Duplicated.isDuplicatedName=1
    then concat(studentInfo.studentName, '(', right(trim(replace(studentInfo.studentPhone, '-', '')), 4), ')')
    else studentInfo.studentName
  end as studentNameDup,
  ifnull(lesson.isCanBeClosed, 1) as isCanBeClosed,
  ifnull(lesson.billingRegSize, 0) as billingRegSize
from
  studentID left join
  studentInfo on
    studentID.studentID=studentInfo.studentID left join
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
  (select
    billing.studentID,
    max(lesson.lessonMonth) as lessonMonthLast,
    sum(ifnull(lesson.lessonEnded=0, 0))=0 as isCanBeClosed,
    sum(ifnull(billing.billingRetractable=1, 0)) as billingRegSize
  from
    lesson right join
    billing on
      lesson.quarterID=billing.quarterID and
      lesson.lessonMonth=billing.lessonMonth
  group by
    billing.studentID
  ) as lesson on
    studentID.studentID=lesson.studentID left join
  (select
    billing.studentID,
    billing.lessonMonth,
    quarter.quarterName as quarterNameLesson
  from
    billing left join
    quarter on
      quarter.quarterID=billing.quarterID
  ) as billing on
    lesson.studentID=billing.studentID and
    lesson.lessonMonthLast=billing.lessonMonth left join
  quarter on
    quarter.quarterID=studentInfo.quarterID
where
  studentID.unused=0 and
  (studentInfo.studentName like concat('%', ?, '%') or quarter.quarterName like concat('%', ?, '%'))
order by
  studentInfo.studentName asc
limit
  ?, ?`);
const fetchStudentsLenQuery = (
`select
  count(*) as total
from
  studentID left join
  studentInfo on
    studentID.studentID=studentInfo.studentID
where
  studentID.unused=0 and
  (studentInfo.studentName like concat('%', ?, '%') or (select quarterName from quarter where quarter.quarterID=studentInfo.quarterID) like concat('%', ?, '%'))`);

module.exports = async function(
  req, res
) {
  //const teacherID = req.session?.tid;
  //const isOp = getInfo(teacherID).op;
  const quarterID = req.params.quarterID;
  const offset = req.query.offset - 0; // 1.5 or later
  const size = req.query.size - 0; // 1.5 or later
  const keyword = req.query.keyword ?? ''; // 1.5 or later
  const conn = await pool.getConnection();
  try {
    const info = await conn.query(fetchStudentsLenQuery, [
      keyword, keyword
    ]);
    if(!info?.length) {
      NotFound(res);
    }
    const total = info[0].total;
    const totalPage = Math.ceil(total / size);
    const rows = await conn.query(fetchStudentsQuery, [ keyword, keyword, offset, size ]);
    if(!rows?.length) {
      NotFound(res);
    } else {
      OK(res, {
        total,
        totalPage,
        rows
      });
    }
  } catch(err) {
    InternalError(res, err);
  }
  conn.release();
};
