const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

module.exports = async function(
  req, res
) {
  const weekNum = req.params?.weekNum;
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  pool.query(`
select
  checking.*,
  (select
    case
      when Duplicated.isDuplicatedName=1
      then concat(studentInfo.studentName, '(', right(trim(replace(studentInfo.studentPhone, '-', '')), 4), ')')
      else studentInfo.studentName
    end as studentNameDup
  from
    studentInfo left join
    (select
      studentInfo.studentName,
      1 as isDuplicatedName
    from
      studentInfo
    group by
      studentInfo.studentName
    having
      count(studentInfo.studentName) > 1
    ) as Duplicated on
      studentInfo.studentName=Duplicated.studentName
  where
    checking.studentID=studentInfo.studentID
  ) as studentNameDup
from
  checking inner join
  billing on
    checking.studentID=billing.studentID and
    checking.quarterID=billing.quarterID and
    checking.lessonMonth=billing.lessonMonth
where
  date_format(checking.lessonMonth, '%Y-%m')=date_format(?, '%Y-%m') and checking.quarterID=? and checking.studyWeek=?`,
    [ lessonMonth, quarterID, weekNum-0 ]
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
};
