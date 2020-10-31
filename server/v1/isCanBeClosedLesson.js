const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   마감 가능한 출석부인지
   조건1. 마감 안 된 레슨
   조건2. 날짜가 이번달이 아님
   조건3. 레슨이 발행되어 있음
*/

module.exports = async function(
  req, res, next
) {
  const quarterID = req.params?.quarterID ?? null;
  const lessonMonth = req.params?.lessonMonth ?? null;
  pool.query(`
select
  0 as when1,
  0 as when2,
  0 as when3
union
select
  case when lessonEnded=0 then 1 else 0 end as when1,
  case when date_format(current_date, '%Y-%m')<>date_format(lessonMonth, '%Y-%m') then 1 else 0 end as when2,
  1 as when3
from
  lesson
where
  quarterID=? and
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')
order by when3 desc
limit 1`,
    [ quarterID, lessonMonth ]
  )
  .then(r => {
    const { when1, when2, when3 } = r[0];
    when && when2 && when3 ? next() : Forbidden(res);
  })
  .catch(e => BadRequest(res, e));
};
