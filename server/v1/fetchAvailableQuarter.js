const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   지정한 달에 수강 등록이 가능한 반
*/

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth;
  pool.query(`
    select quarterID, quarterName from quarter where unused=0 and quarterID not in (select quarterID from lesson where date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')) order by quarterID`,
    [ lessonMonth ]
  )
  .then(r => OK(res, r))
  .catch(e => BadRequest(res, e));
};
