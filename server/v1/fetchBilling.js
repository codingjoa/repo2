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
  case
    when available.studentID is null
    then 0
    else 1
  end as Registered,
  billingGroup,
  billingPayment,
  billingPrice,
  billingRetractable,
  studentInfo.studentID,
  studentInfo.studentName,
  studentInfo.studentBirthday,
  studentInfo.unused as studentUnused,
  (select quarterName
  from quarter
  where quarter.quarterID=available.quarterID
  ) as quarterName,
  (select unused
  from quarter
  where quarter.quarterID=available.quarterID
  ) as quarterUnused
from
(select
  studentID,
  quarterID,
  billingGroup,
  billingPayment,
  billingPrice,
  billingRetractable
from billing
where
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m')
) as available
right join
(select
  studentInfo.*,
  studentID.unused
from
  studentInfo,
  studentID
where
  studentID.studentID=studentInfo.studentID
) as studentInfo
on available.studentID=studentInfo.studentID
where
  available.billingRetractable=0 or
  unused=0
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
