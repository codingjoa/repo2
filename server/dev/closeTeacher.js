const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

const setUnusedQuery = (
`update
  teacher
set
  unused=1
where
  teacherID=?
limit
  1`);
const setTeacherLeavedQuery = (
`update
  teacherLeaving
set
  teacherLeaved=concat(date_format(current_date, '%Y-%m'), '-01')
where
  teacherID=?
limit
  1`);

async function closeTeacher(
  teacherID
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await conn.query(setUnusedQuery,
      [ teacherID ]
    );
    await conn.query(setTeacherLeavedQuery,
      [ teacherID ]
    );
    const k = await conn.query('select * from teacherLeaving');
    console.log(k);
    conn.rollback();
    conn.release();
    if(!result?.affectedRows) throw new Error('변경되지 않았습니다.')
  } catch(err) {
    conn.rollback();
    conn.release();
    throw err;
  }
}
/* @codingjoa
   사용하지 않는 선생으로 변경
*/
module.exports = async function(
  req, res
) {
  const teacherID = req.params?.teacherID;
  try {
    await closeTeacher(teacherID);
    OK(res);
  } catch (err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const teacherID = process.env.TID ?? 1212;
  try {
    await closeTeacher(teacherID);
  } catch(err) {
    console.error(err);
  }
  await pool.end();
})();
