const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   이번달 레슨을 등록
   이 과정은 철회할 수 없음.
   레슨이 등록되어 수업 배치, 입금을 철회할 수 없음
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  await Promise.all([
    pool.query(`
      insert into lesson(quarterID, lessonMonth)
      select quarterID, lessonMonth from lessonCharge where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and chargeRetractable=1`,
      [ quarterID ]
    ),
    pool.query(`
      insert into study(quarterID, lessonMonth, studyWeek)
      select quarterID, lessonMonth, 1 as studyWeek from lessonCharge where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and chargeRetractable=1
      union all
      select quarterID, lessonMonth, 2 as studyWeek from lessonCharge where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and chargeRetractable=1
      union all
      select quarterID, lessonMonth, 3 as studyWeek from lessonCharge where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and chargeRetractable=1
      union all
      select quarterID, lessonMonth, 4 as studyWeek from lessonCharge where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and chargeRetractable=1`,
      [ quarterID, quarterID, quarterID, quarterID ]
    ),
    pool.query(`
      insert into checking(quarterID, lessonMonth, studyWeek, studentID)
      select quarterID, lessonMonth, 1 as studyWeek, studentID from billing where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and billingRetractable=1
      union
      select quarterID, lessonMonth, 2 as studyWeek, studentID from billing where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and billingRetractable=1
      union
      select quarterID, lessonMonth, 3 as studyWeek, studentID from billing where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and billingRetractable=1
      union
      select quarterID, lessonMonth, 4 as studyWeek, studentID from billing where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and billingRetractable=1`,
      [ quarterID, quarterID, quarterID, quarterID ]
    )
  ])
  .catch(e => BadRequest(res, e))
  Promise.all([
    pool.query(`
      update billing set billingRetractable=0 where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and billingRetractable=1`,
      [ quarterID ]
    ),
    pool.query(`
      update lessonCharge set chargeRetractable=0 where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and quarterID=? and chargeRetractable=1`,
      [ quarterID ]
    )
  ])
  .then(r => OK(res))
  .catch(e => BadRequest(res, e))
};
