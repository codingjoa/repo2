const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');
const whenStudyOkSizeInQuery = (
`select
  case
    when A.studyOkSize+1 >= ?
    then 1
    else 0
  end as when1
from
  (select
    study.quarterID,
    study.lessonMonth,
    count(distinct study.studyWeek) as studySize,
    count(distinct case
      when checking.checkModified is not null
      then checking.studyWeek
      else null
    end) as studyOkSize
  from
    study left join
    checking on
      study.quarterID=checking.quarterID and
      study.lessonMonth=checking.lessonMonth
  group by
    study.quarterID,
    study.lessonMonth
  ) as A
where
  A.quarterID=? and
  date_format(?, '%Y-%m')=date_format(A.lessonMonth, '%Y-%m')`);
/* @codingjoa
   반 이름 변경
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID;
  const lessonMonth = req.params?.lessonMonth;
  const studyWeek = req.params?.weekNum;
  const changeTarget = req.body?.targets;
  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    const when = await conn.query(whenStudyOkSizeInQuery, [
      studyWeek,
      quarterID,
      lessonMonth
    ]);
    if(when?.length === 0) {
      throw new Error('잘못된 반을 지정하였습니다.');
    }
    const result = await conn.query(
`update
  checking
set
  checkOk = case checkOk
    when 1
    then 0
    else 1
  end
where
  studyWeek=? and
  quarterID=? and
  date_format(?, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and
  studentID in (${changeTarget.toString()})`,
      [ studyWeek, quarterID, lessonMonth ]
    );
    if(!result.affectedRows === 0) {
      throw new Error('변경되지 않았습니다.');
    }
    OK(res);
    await conn.commit();
    await conn.release();
  } catch(err) {
    BadRequest(res, err);
    await conn.rollback();
    await conn.release();
  }
};
