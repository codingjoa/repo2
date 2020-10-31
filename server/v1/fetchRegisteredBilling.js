const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   생성된 수강 등록 조회
   조건1. 요청한 달만
*/

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth ?? null;
  pool.query(`
select
  1 as Registered,
  billingGroup,
  billingPayment,
  billingPrice,
  billingRetractable,
  studentInfo.studentID,
  studentName,
  studentBirthday,
  (select
    unused
  from
    studentID
  where
    studentID.studentID=studentInfo.studentID
  ) as studentUnused,
  (select quarterName
  from quarter
  where quarter.quarterID=billing.quarterID
  ) as quarterName,
  (select unused
  from quarter
  where quarter.quarterID=billing.quarterID
  ) as quarterUnused
from
  billing, studentInfo
where
  billing.studentID=studentInfo.studentID and
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')
order by
  studentInfo.studentID
  asc`,
    [ lessonMonth ]
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
