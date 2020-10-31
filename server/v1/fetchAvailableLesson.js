const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   이번달 발행 가능한 출석부 목록
*/

module.exports = async function(
  req, res
) {
  pool.query(`
    select
      quarterID,
      quarterName,
      (select count(*)
      from billing
      where
        quarter.quarterID=billing.quarterID and
        date_format(billing.lessonMonth, '%Y-%m')=date_format(current_date, '%Y-%m')
      ) as students,
      (select count(*)
      from billing
      where
        quarter.quarterID=billing.quarterID and
        date_format(billing.lessonMonth, '%Y-%m')=date_format(current_date, '%Y-%m') and
        billing.billingGroup>0
      ) as groupStudent,
      (select count(*)
      from billing
      where
        quarter.quarterID=billing.quarterID and
        date_format(billing.lessonMonth, '%Y-%m')=date_format(current_date, '%Y-%m') and
        billing.billingGroup=0
      ) as singleStudent
    from quarter
    where
      unused=0 and
      quarterID not in (select quarterID from lesson where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m')) and
      quarterID in (select quarterID from billing where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m'))
    order by quarterID`,
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
