const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   마감 가능한 출석부인지
   조건1. 마감 안 된 레슨
   조건2. 날짜가 이번달이 아님
*/

module.exports = async function(
  req, res, next
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  pool.query(`
    select case when count(*)>0 then 1 else 0 end as permission
    from lesson
    where
    quarterID=? and
    date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and
    date_format(current_date, '%Y-%m')<>date_format(lessonMonth, '%Y-%m')`,
    [ quarterID ?? null, lessonMonth ?? null ]
  )
  .then(r => {
    r[0].permission ? next() : Forbidden(res);
  })
  .catch(e => BadRequest(res, e));
};
