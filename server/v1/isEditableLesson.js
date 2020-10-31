const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   수강 등록 철회 가능 여부
   조건1. 레슨이 생성되지 않음
*/

module.exports = async function(
  req, res, next
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  const teacherID = req.session?.tid;
  pool.query(`
    select case when max(lessonEnded)=0 then 1 else 0 end as permission
    from lesson
    where quarterID=? and date_format(lessonMonth, '%Y-%m')=date_format(?, '%Y-%m') and teacherID=?`,
    [ quarterID ?? null, lessonMonth ?? null, teacherID ]
  )
  .then(r => {
    r[0].permission===1 ? next() : Forbidden(res);
  })
  .catch(e => BadRequest(res, e));
};
