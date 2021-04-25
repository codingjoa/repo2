const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');
const fetchQuartersQuery = (
`select
  quarter.*,
  (select
    teacherName
  from
    teacher
  where
    quarter.teacherID=teacher.teacherID
  ) as teacherName,
  (select case when count(*)>0 then 0 else 1 end as isCanBeClosed
  from lesson
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
from quarter
where unused=0`
);
async function fetchQuarters() {
  try {
    const rows = await pool.query(fetchQuartersQuery);
    return rows;
  } catch(err) {
    throw err;
  }
}

/* @codingjoa
   전체 반 목록을 조회합니다.
*/

module.exports = async function(
  req, res
) {
  try {
    const rows = await fetchQuarters();
    !rows.length && NotFound(res);
    rows.length && OK(res, rows);
  } catch(err) {
    BadRequest(res, err);
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
