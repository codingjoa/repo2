const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');
const createLesson = (
`insert into
  lesson(
    quarterID,
    teacherID,
    lessonMonth
  )
select
  ? as quarterID,
  (select
    teacherID
  from
    quarter
  where
    ?=quarterID
  limit 1) as teacherID,
  concat(date_format(current_date, '%Y-%m'), '-01') as lessonMonth`);
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

async function addLesson(
  quarterID,
  studySize
) {
  let success = false;

  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    await conn.query(
      createLesson,
      [ quarterID,
        quarterID
      ]
    );
    for(let i=1; i<=studySize; i++) {
      await conn.query(createStudy, [ i, quarterID ]);
      await conn.query(createChecking, [ i, quarterID ]);
    }
    await conn.query(updateBillingRetractable, [ quarterID ]);
    await conn.commit();
    await conn.release();
    success = true;
  } catch(err) {
    console.error(err);
    await conn.rollback();
    await conn.release();
    throw err;
  }
  return success;
}

/* @codingjoa
   이번달 레슨을 등록(년월 파라미터 필요 없음)
   이 과정은 철회할 수 없음.
   레슨이 등록되어 수업 배치, 입금을 철회할 수 없음
*/

module.exports = async function(
  req, res
) {
  const quarterID = req.params?.quarterID ?? null;
  const studySize = req.body?.studySize ?? 4;
  // teacherID 삭제
  try {
    const ok = await addLesson(
      quarterID,
      studySize
    );
    ok === false && BadRequest(res); // 실패했고 롤백함
    ok === true && OK(res, ok); // 성공함
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const quarterID = process.env?.QID ?? 5;
  const studySize = process.env?.SSIZE ?? 4;
  try {
    const ok = await addLesson(
      quarterID,
      studySize
    );
    //ok === false && BadRequest(res); // 실패했고 롤백함
    //ok === true && OK(res, ok); // 성공함
  } catch(err) {
    //BadRequest(res, err);
  }
  pool.end();
})();
