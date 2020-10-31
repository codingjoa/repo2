const { BadRequest, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   발행 가능 여부 확인
   조건1. 학생이 1명 이상 등록되어 있음
   조건2. 이번달에 발행되지 않은 반/실존하는 사용 가능한 반이어야 함

   조건2 대체. 출석부가 이미 발행됐는지 확인
select 0 as permission
union
select case when quarterID is null then 0 else 1 end as permission from (
select quarterID from quarter where quarterID=5 and quarterID not in (select quarterID from lesson where lessonMonth='2020-10-01')
) p order by permission desc limit 1;

*/

module.exports = async function(
  req, res, next
) {
  const quarterID = req.params?.quarterID;
  pool.query(`
    select
    (select case when count(*)>0 then 1 else 0 end as permission
    from billing where
    date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and
    quarterID=? limit 1) as when1,
    (select case when ? in (select quarterID from quarter where unused=0 and quarterID not in (select quarterID from lesson where date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m')) order by quarterID)
    then 1
    else 0 end as permission limit 1) as when2`,
    [ quarterID, quarterID, quarterID ]
  )
  .then(r => {
    const { when1, when2 } = r[0];
    when1 && when2 ? next() : Forbidden(res);
  })
  .catch(e => BadRequest(res, e));
};
