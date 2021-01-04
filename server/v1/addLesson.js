const { OK, BadRequest } = require('../format');
const { pool, end } = require('../poolManager');
const execAsync = require('../execAsync');
const createLesson = (
`insert into
  lesson(quarterID, teacherID, lessonMonth)
select
  ? as quarterID,
  ? as teacherID,
  concat(date_format(current_date, '%Y-%m'), '-01') as lessonMonth`
);
const createStudy = (
`insert into study(studyWeek, quarterID, lessonMonth)
select
  ? as studyWeek,
  ? as quarterID,
  concat(date_format(current_date, '%Y-%m'), '-01') as lessonMonth`
);
const createChecking = (
`insert into checking(quarterID, lessonMonth, studyWeek, studentID)
select
  quarterID,
  lessonMonth, ? as studyWeek,
  studentID
from
  billing
where
  date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and
  quarterID=? and
  billingRetractable=1`
);
const updateBillingRetractable = (
`update
  billing
set
  billingRetractable=0
where
  date_format(current_date, '%Y-%m')=date_format(lessonMonth, '%Y-%m') and
  ?=quarterID and
  billingRetractable=1`
);

async function addLesson(quarterID, teacherID, studySize) {
  let success = false;

  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    await conn.query(
      createLesson,
      [ quarterID,
        teacherID
      ]
    );
    for(let i=1; i<=studySize; i++) {
      await conn.query(createStudy, [ i, quarterID ]);
      await conn.query(createChecking, [ i, quarterID ]);
    }
    conn.query(updateBillingRetractable, [ quarterID ]);
    await conn.commit();
    success = true;
  } catch(err) {
    console.error(err);
    await conn.rollback();
  }
  await conn.release();
  return success;
}

/* @codingjoa
   이번달 레슨을 등록(년월 파라미터 필요 없음)
   이 과정은 철회할 수 없음.
   레슨이 등록되어 수업 배치, 입금을 철회할 수 없음
*/

module.exports = function(
  req, res
) {
  const teacherID = req.params?.teacherID ?? null;
  const quarterID = req.params?.quarterID ?? null;
  const studySize = req.params?.studySize ?? 4;
  execAsync(addLesson, (err, ok) => {
    if(err) {
      BadRequest(res, err);
      return;
    }
    // 실패했고 롤백함
    ok === false && BadRequest(res);
    // 성공함
    ok === true && OK(res, ok);
  })(quarterID, teacherID, studySize);
};
module.id === require.main.id && (() => {
  setTimeout(() => (

  execAsync(addLesson, (err, ok) => {
    err && console.error(err);
    ok && console.log(ok);
    end();
  })(27, 1212, 16)), 3000);
})();
