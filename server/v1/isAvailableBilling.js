const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   수강 등록 가능 여부 확인
   조건1. 실존하는 학생이며 사용 가능한 학생
   조건2. 실존하능 학생이 이미 수강등록하지 않음
   조건3. 실존하는 반임
   조건4. 실존하는 반이 이번 달 수업 하기 전임
*/

module.exports = async function(
  req, res, next
) {
  const lessonMonth = req.params?.lessonMonth;
  const reqIter = req.body?.reqIter;
  if(!reqIter) {
    return BadRequest(res, new Error('잘못된 요청입니다.'));
  }
  const conn = await pool.getConnection();
  const promise = reqIter.map(({ studentID, quarterID }) => 
  conn.query(`
    select
    (select case when count(*)>0 then 1 else 0 end as permission from studentID where studentID.studentID=? and unused=0) as when1,
    (select case when count(*)>0 then 0 else 1 end as permission from billing where
    studentID=? and date_format(lessonMonth, '%Y-%m')=date_format(?, '%Y-%m')) as when2,
    (select case when count(*)>0 then 1 else 0 end as permission from quarter where quarterID=?) as when3,
    (select case when count(*)>0 then 0 else 1 end as permission from lesson where quarterID=? and lessonMonth=?) as when4`,
    [ studentID, studentID, lessonMonth, quarterID, quarterID, lessonMonth ]
  ));

  Promise.all(promise)
  .then(r => {
    for (const s of r) {
      const { when1, when2, when3, when4 } = s[0];
      if(when1 && when2 && when3 && when4) continue
      else {
        Forbidden(res);
        return;
      };
    }
    next();
  })
  .catch(e => BadRequest(res, e));
};
