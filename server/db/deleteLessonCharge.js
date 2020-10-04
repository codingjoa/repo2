const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   선생 배정을 취소
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  pool.query(`
    delete from lessonCharge where quarterID=? and lessonMonth=? limit 1`,
    [ quarterID ?? null, lessonMonth ?? null ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('삭제되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
