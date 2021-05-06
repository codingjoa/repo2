const { OK, NotFound, InternalError } = require('../format');
const { pool } = require('../poolManager');
const fetchAllTeacherQuery = (
`select
  teacherID,
  teacherName,
  teacherOp,
  teacherAccount,
  isForeigner,
  (select case when count(*)>0 then 0 else 1 end as isCanBeClosed
  from lesson
  where
    lesson.teacherID=teacher.teacherID and
    lesson.lessonEnded=0
  ) as isCanBeClosed
from
  teacher
where
  teacher.unused=0`);
const fetchTeacherQuery = (
`select
  teacherID,
  teacherName,
  teacherOp,
  teacherAccount,
  isForeigner,
  (select case when count(*)>0 then 0 else 1 end as isCanBeClosed
  from lesson
  where
    lesson.teacherID=teacher.teacherID and
    lesson.lessonEnded=0
  ) as isCanBeClosed
from
  teacher
where
  teacher.unused=0 and
  teacher.teacherName like concat('%', ?, '%')
limit
  ?, ?`);

/* @codingjoa
   GET
   선생님 목록을 반환
*/

module.exports = async function(
  req, res
) {
  const offset = req.query.offset ?? null;
  const size = req.query.size ?? null;
  const keyword = req.query.keyword ?? '';
  let targetQuery = fetchTeacherQuery;
  if(
    offset === null ||
    size === null
  ) {
    targetQuery = fetchAllTeacherQuery;
  }
  try {
    const rows = await pool.query(targetQuery, [
      keyword,
      offset - 0,
      size - 0
    ]);
    rows.length && OK(res, rows);
    !rows.length && NotFound(res);
  } catch(err) {
    InternalError(res, err);
  }
};
