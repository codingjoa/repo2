const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');
const fetchAvailableBillingRangeQuery = (
`select
  case
    when billing.studentID is null
    then 0
    else 1
  end as isAvailable,
  billing.studentID
from
  (select
    studentID.studentID,
    studentID.unused,
    ? as lessonMonth
  from
    studentID
  ) as studentID left join
  billing on
    studentID.studentID=billing.studentID and
    studentID.lessonMonth=billing.lessonMonth
where
  studentID.studentID=? and
  studentID.unused=0
`);
async function fetchAvailableBillingRange(
  lessonMonths,
  studentID
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const a = {};
    for(const lessonMonth of lessonMonths) {
      const rows = await conn.query(fetchAvailableBillingRangeQuery, [ lessonMonth, studentID ]);
      a[lessonMonth] = rows[0] ? rows[0].isAvailable : null;
    }
    await conn.commit();
    await conn.release();
    return a;
  } catch(err) {
    await conn.rollback();
    await conn.release();
    throw err;
  }
}

module.exports = async function(
  req, res
) {
  const studentID = req.params?.studentID;
  const lessonMonth = req.query?.lessonMonth;
  try {
    const status = await fetchAvailableBillingRange(
      lessonMonth,
      studentID
    );
    OK(res, status);
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const studentID = process.env?.SID ?? 10;
  const lessonMonth = process.env?.LM ?? ['2020-10-01', '2020-11-01', '2020-12-01'];
  try {
    await fetchAvailableBillingRange(
      lessonMonth,
      studentID
    ).then(console.log);
  } catch(err) {
    console.error(err);
  }
  pool.end();
})();
