const { OK, NotFound, InternalError } = require('../format');
const { pool } = require('../poolManager');
const fetchQuartersQuery = (
`select
  quarter.*,
  teacher.teacherName,
  (select
    case
      when count(*)>0
      then 0
      else 1
    end as isCanBeClosed
  from
    lesson
  where
    lessonEnded=0 and
    lesson.quarterID=quarter.quarterID
  union
  select case when count(*)>0 then 0 else 1 end as isCanBeClosed
  from billing
  where
    billingRetractable=1 and
    billing.quarterID=quarter.quarterID
  order by isCanBeClosed asc
  limit 1
  ) as isCanBeClosed
from
  quarter left join
  teacher on
    quarter.teacherID=teacher.teacherID
where
  quarter.unused=0 and
  (quarter.quarterName like concat('%', ?, '%') or teacher.teacherName like concat('%', ?, '%'))
order by
  teacher.teacherName asc,
  quarter.quarterName asc
limit
  ?, ?`);
const fetchQuartersLenQuery = (
`select
  count(*) as total
from
  quarter left join
  teacher on
    quarter.teacherID=teacher.teacherID
where
  quarter.unused=0 and
  (quarter.quarterName like concat('%', ?, '%') or teacher.teacherName like concat('%', ?, '%'))`);
async function fetchQuarters(
  keyword,
  offset,
  limit
) {
  const conn = await pool.getConnection();
  try {
    const info = await conn.query(fetchQuartersLenQuery, [
      keyword, keyword
    ]);
    if(!info?.length) {
      NotFound(res);
    }
    const total = info[0].total;
    const totalPage = Math.ceil(total / limit);
    const rows = await conn.query(fetchQuartersQuery, [
      keyword,
      keyword,
      offset,
      limit
    ]);
    await conn.release();
    return {
      total,
      totalPage,
      rows
    };
  } catch(err) {
    await conn.release();
    throw err;
  }
}

/* @codingjoa
   전체 반 목록을 조회합니다.
*/

module.exports = async function(
  req, res
) {
  const offset = req.query.offset - 0;
  const size = req.query.size - 0;
  const keyword = req.query.keyword ?? '';
  try {
    const result = await fetchQuarters(
      keyword,
      offset,
      size
    );
    if(result.rows.length === 0) {
      NotFound(res);
    } else {
      OK(res, result);
    }
  } catch(err) {
    InternalError(res, err);
  }
};
module.id === require.main.id && (async () => {
  try {
    const rows = await fetchQuarters();
    console.log(rows);
  } catch(err) {
    console.error(err);
  }
  pool.end();
})();
