const { OK, NotFound, InternalError } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   담당하는 작업 가눙한 출석부 목록 조회
*/
const fetchLessonsQuery = (
`select
  quarterID,
  (select quarterName
  from quarter
  where quarter.quarterID=lesson.quarterID
  ) as quarterName,
  lessonMonth
from lesson
where
  lessonEnded=0 and
  lesson.teacherID=? and
  (select
    quarterName
  from
    quarter
  where
    quarter.quarterID=lesson.quarterID
  ) like concat('%', ?, '%')
limit ?, ?`);
const fetchLessonsLenQuery = (
`select
  count(*) as total
from
  lesson
where
  lessonEnded=0 and
  lesson.teacherID=? and
  (select
    quarterName
  from
    quarter
  where
    quarter.quarterID=lesson.quarterID
  ) like concat('%', ?, '%')`);


module.exports = async function(
  req, res
) {
  const teacherID = req.session?.tid;
  const offset = req.query.offset - 0 ?? 0; // 1.5 or later
  const limit = req.query.size - 0 ?? 10; // 1.5 or later
  const keyword = req.query.keyword ?? ''; // 1.5 or later
  const conn = await pool.getConnection();
  try {
    const info = await conn.query(fetchLessonsLenQuery, [
      teacherID, keyword
    ]);
    if(!info?.length) {
      NotFound(res);
    }
    const total = info[0].total;
    const totalPage = Math.ceil(total / limit);
    const rows = await conn.query(fetchLessonsQuery,
      [ teacherID, keyword, offset, limit ]
    );
    if(!rows?.length) {
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
    InternalError(res, err);
    conn.release();
  }
};
