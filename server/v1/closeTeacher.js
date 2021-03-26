const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

const setUnusedQuery = (
`update
  teacher
set
  unused=1
where
  unused=0 and
  teacherID=?
limit
  1`);
const setTeacherLeavedQuery = (
`update
  teacherLeaving
set
  teacherLeaved=current_date
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
    if(!result?.affectedRows) throw new Error('변경되지 않았습니다.')
    const result2 = await conn.query(setTeacherLeavedQuery,
      [ teacherID ]
    );
    if(!result2?.affectedRows) throw new Error('변경되지 않았습니다.')
    const k = await conn.query('select * from teacherLeaving');
    console.log(k);
    await conn.commit();
    await conn.release();
  } catch(err) {
    await conn.rollback();
    await conn.release();
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
