const { CommonError } = require('../format');
const { pool } = require('../poolManager');
const isOwnQuarterQuery = (
`select
  quarter.quarterID is not null
from quarter
where
  quarter.teacherID=? and
  quarter.quarterID=?`);

async function isOwnQuarter(
  teacherID,
  quarterID
) {
  const result = await pool.query(isOwnQuarterQuery, [
    teacherID,
    quarterID
  ]);
  if(result.length === 0) {
    throw new CommonError('반을 관리할 권한이 없습니다.');
  }
}
module.exports = async function(
  req, res, next
) {
  try {
    const teacherID = req.session?.tid;
    const quarterID = req.params?.quarterID;
    await isOwnQuarter(
      teacherID,
      quarterID
    );
    next();
  } catch(err) {
    next(err);
  }
};
