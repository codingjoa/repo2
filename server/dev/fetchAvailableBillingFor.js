const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   수강 등록이 가능한 학생 목록+반
*/

module.exports = async function(
  req, res
) {
  const studentID = req.params?.studentID;
  const quarterID = req.params?.quarterID;
  //const lessonMonth = req.params?.lessonMonth;
  let months;
  try {
    const date = new Date();
    date.setDate(1);
    const one = `${date.getFullYear()}-${date.getMonth()+1}-1`;
    date.setMonth(date.getMonth()+1);
    const two = `${date.getFullYear()}-${date.getMonth()+1}-1`;
    date.setMonth(date.getMonth()+1);
    const three = `${date.getFullYear()}-${date.getMonth()+1}-1`;
    months = [
      one, two, three
    ];
  }
  catch(e) {
    BadRequest(res, e);
    return;
  }
  pool.query(`
select one.lessonMonth, alreadyBilling, alreadyLesson
from
  (select
  month.lessonMonth, count(studentID) as alreadyBilling
  from
    billing right join
    (select ? as lessonMonth
    union
    select ? as lessonMonth
    union
    select ? as lessonMonth
    ) as month
    on date_format(billing.lessonMonth, '%Y-%m')=date_format(month.lessonMonth, '%Y-%m') and
      billing.studentID=?
  group by month.lessonMonth
  ) as one
  inner join
  (select month.lessonMonth, count(teacherID) as alreadyLesson
  from
    lesson right join
    (select ? as lessonMonth
    union
    select ? as lessonMonth
    union
    select ? as lessonMonth
    ) as month
    on
    date_format(lesson.lessonMonth, '%Y-%m')=date_format(month.lessonMonth, '%Y-%m') and
    lesson.quarterID=?
  group by month.lessonMonth
  ) as two
  on
    one.lessonMonth=two.lessonMonth`,
    [ ...months, studentID, ...months, quarterID]
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
