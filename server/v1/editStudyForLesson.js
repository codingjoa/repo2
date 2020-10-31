const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   반 이름 변경
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  const studyWeek = req.params?.weekNum;
  const changeTarget = req.body?.targets;
  pool.query(`
    update checking
    set checkOk = case checkOk when 1 then 0 else 1 end
    where studyWeek=? and
    quarterID=? and
    date_format(lessonMonth, '%Y-%m')=date_format(?, '%Y-%m') and
    studentID in (${changeTarget.toString()})`,
    [ studyWeek, quarterID, lessonMonth ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};