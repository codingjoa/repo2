const { OK, NotFound, InternalError } = require('../format');
const { pool } = require('../poolManager');
const fetchTeacherProceedsQuery = (
`select
  teacher.teacherID,
  teacher.teacherName,
  ifnull(count(billing.billingPrice), 0) as totalStudent,
  sum(ifnull(billing.billingPrice, 0) - ifnull(billing.billingRefundPrice, 0)) as totalPrice,
  sum(ifnull(billing.billingRefundPrice, 0)) as totalRefundPrice,
  sum(ifnull(billing.billingUnpaidCode, 0)) as totalUnpaidPrice
from
  teacher left join
  lesson on
    teacher.teacherID=lesson.teacherID left join
  billing on
    lesson.quarterID=billing.quarterID and
    lesson.lessonMonth=billing.lessonMonth
where
  date_format(?, '%Y-%m')=date_format(lesson.lessonMonth, '%Y-%m')
group by
  teacher.teacherID`);
async function fetchTeacherProceeds(
  lessonMonth,
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const rows = await conn.query(fetchTeacherProceedsQuery, [
      lessonMonth
    ]);
    await conn.commit();
    await conn.release();
    return rows;
  } catch(err) {
    await conn.rollback();
    await conn.release();
    throw err;
  }
}
module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth;
  try {
    const rows = await fetchTeacherProceeds(
      lessonMonth
    );
    !rows.length && NotFound(res);
    rows.length && OK(res, rows);
  } catch(err) {
    InternalError(res, err);
  }
};
