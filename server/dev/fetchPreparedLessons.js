/* @codingjoa
   GET /api/admin/

   200 OK
   400 BadRequest
   404 NotFound
*/
const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');
const fetchLessonPrepare = (
`select
  quarter.quarterID,
  quarter.quarterName,
  lessonPrepare.teacherID,
  teacher.teacherName,
  lessonPrepare.studySize,
  case
    when lessonPrepare.lessonMonth is not null
    then 1
    else 0
  end as RegCode
from
  (select ? as lessonMonth) as lessonMonth left join
  quarter on 1 left join
  lessonPrepare on
    quarter.quarterID=lessonPrepare.quarterID and
    lessonMonth.lessonMonth=lessonPrepare.lessonMonth left join
  teacher on
    lessonPrepare.teacherID=teacher.teacherID
where
  quarter.unused=0 and
  lessonMonth.lessonMonth between
    concat(date_format(current_date, '%Y-%m'), '-01') and '9999-12-31'`);
async function fetchPreparedLessons(
  lessonMonth
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await conn.query(fetchLessonPrepare, [
      lessonMonth
    ]).then(rows => (rows.length > 0 ? rows : null));
    await conn.release();
    process.env.DEBUG === '1' && console.log(result);
    return result;
  } catch(err) {
    process.env.ERROR === '1' && console.error(err);
    await conn.release();
    throw error;
  }
}

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth ?? null;
  if(lessonMonth);
  else {
    BadRequest(res, new TypeError('Parameter Required.'));
    return;
  }
  try {
    let r;
    if((r = await fetchPreparedLessons(
      lessonMonth
    ))) {
      OK(res, r);
    } else {
      NotFound(res);
    }
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  try {
    await fetchPreparedLessons(
      '2021-03-01'
    );
  } catch(err) {

  }
  await pool.end();
})();
