const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   해당 레슨 접근 가능 여부

   다른 괴상한 방법
select case when
count((select quarterID from lessonCharge
where lessonCharge.quarterID=lesson.quarterID and
lessonMonth='2020-10-01' and
teacherID=1212 and
quarterID=17))>0 then 1 else 0 end as permission from lesson;

*/

module.exports = async function(
  req, res, next
) {
  const teacherID = req.session?.tid;
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  pool.query(`
select
  case when count(*)>0 then 1 else 0 end as permission
from lesson
where
  date_format(lessonMonth, '%Y-%m')=date_format(?, '%Y-%m') and
  lesson.teacherID=? and
  lesson.quarterID=?`,
    [ lessonMonth ?? '2000-01-01' , teacherID ?? null, quarterID ?? null ]
  )
  .then(r => {
    r[0].permission ? next() : Forbidden(res);
  })
  .catch(e => BadRequest(res, e));
};
