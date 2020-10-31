const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   해당 레슨 하위 정보 조회
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  const general = await pool.query(`
select
  quarterID,
  (select quarterName
  from quarter
  where quarter.quarterID=lesson.quarterID
  ) as quarterName,
  (select teacherID
  from teacher
  where teacher.teacherID=lesson.teacherID
  ) as teacherID,
  lessonMonth,
  lessonCreatedAt,
  lessonEnded,
  (select count(*)
  from billing
  where
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth and
    billingGroup=0
  ) as singleStudents,
  (select count(*)
  from billing
  where
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth and
    billingGroup>0
  ) as groupStudents
from lesson
where
  quarterID=? and
  lessonMonth=?`,
    [ quarterID ?? null,
      lessonMonth ?? null
    ]
  )
  .then(r => r.length ? r[0] : undefined)
  .catch(e => BadRequest(res, e));
  if(!general) {
    NotFound(res);
    return;
  }
  const students = await pool.query(`
select studentInfo.*
from studentInfo, billing
where
  billing.studentID=studentInfo.studentID and
  billing.quarterID=? and
  date_format(?, '%Y-%m')=date_format(billing.lessonMonth, '%Y-%m')`,
    [ quarterID ?? null,
      lessonMonth ?? null
    ]
  ).then(r => r.length ? r : undefined)
  .catch(e => BadRequest(res, e));
  OK(res, {
    general, students
  });
};
