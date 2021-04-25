/* @codingjoa
   POST /api/admin/lesson/prepare/:lessonMonth

   200 OK
   400 BadRequest
   404 NotFound
*/
const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');
/*
선생께서 이번달에 담당하고 있는 반이나, 아직 아니지만 곧 담당할 반을 표시
unused가 아닌 모든 반 목록이 모두 표시되어야 함
출석부가 있으면 현재 담당 선생님이 표시되어야 함 (있는 출석부 lesson in (select ...))
출석부가 없으면 예정 담당 선생님이 표시되어야 함
학생/입금 관련 정보가 표시되어야 함
이번달 이전의 날짜는 출석부가 있는 것만 표시되어야 함(unused무시)
*/
const fetchWaitLessonsQuery = (
`select
  Q.quarterID,
  Q.quarterName,
  Q.requestMonth as lessonMonth,
  Q.teacherID,
  teacher.teacherName,
  Q.lessonRegCode,
  Q.lessonEnded,
  K.studentID,
  K.studentName,
  K.billingRegCode,
  concat('[',group_concat(
    concat('[', K.studentID, ',[\"', K.studentName,'\",', case when K.billingRegCode then K.billingGroup>0 else 0 end, ',', case when K.billingRegCode then K.billingPrice else 0 end, ',', K.billingRegCode,']]')
  ),']') as json,
  case
    when Q.lessonRegCode=0 and Q.teacherID is not null and count(K.studentID)>0 and count(K.studentID)=count(case when K.billingRegCode then 1 else null end) and Q.requestMonth=concat(date_format(current_date, '%Y-%m'), '-01')
    then 1
    else 0
  end as isCanBePosted,
  case
    when Q.lessonEnded=0 and Q.lessonRegCode=1 and (Q.lessonMonth=concat(date_format(current_date, '%Y-%m'), '-01'))=0
    then 1
    else 0
  end as isCanBeClosed,
  count(K.studentID) as totalStudent,
  count(case
    when K.billingGroup=0
    then 1
    else null
  end) as singleStudent,
  count(case
    when K.billingGroup>0
    then 1
    else null
  end) as groupStudent,
  count(case
    when K.billingRegCode=0
    then 1
    else null
  end) as unregisteredStudent,
  A.studySize,
  A.studyOkSize,
  sum(case
    when K.billingPrice is not null
    then K.billingPrice
    else 0
  end) as totalPrice,
  sum(case
    when K.billingRefundPrice is not null
    then K.billingRefundPrice
    else 0
  end) as totalRefundPrice
from
  (select
    quarter.quarterID,
    quarter.quarterName,
    lesson.lessonMonth,
    quarter.requestMonth,
    (case
      when lesson.quarterID is null
      then quarter.teacherID
      else lesson.teacherID
    end) as teacherID,
    quarter.unused,
    lesson.quarterID is not null as lessonRegCode,
    lesson.lessonEnded
  from
    (select
      quarter.*,
      concat(date_format(?, '%Y-%m'), '-01') as requestMonth
    from
      quarter
    ) as quarter left join
    lesson on
      quarter.quarterID=lesson.quarterID and
      quarter.requestMonth=lesson.lessonMonth
  where
    0=(case
      when lesson.quarterID is not null
      then 0
      else quarter.unused
    end)
  ) as Q left join


  (select
    studentInfo.studentID,
    studentInfo.studentName,
    studentID.unused,
    (case
      when billing.lessonMonth is null
      then studentInfo.quarterID
      else billing.quarterID
    end) as quarterID,
    billing.lessonMonth,
    billing.billingPrice,
    billing.billingGroup,
    billing.billingRefundPrice,
    billing.quarterID is not null as billingRegCode,
    studentID.requestMonth
  from
    (select
      studentID.*,
      concat(date_format(?, '%Y-%m'), '-01') as requestMonth
    from
      studentID
    ) as studentID left join
    studentInfo on
      studentID.studentID=studentInfo.studentID left join
    billing on
      studentInfo.studentID=billing.studentID and
      studentID.requestMonth=billing.lessonMonth
  ) as K on
      1=(case
        when Q.lessonRegCode=0
        then Q.quarterID=K.quarterID and Q.requestMonth=K.requestMonth and K.unused=0
        else Q.quarterID=K.quarterID and Q.lessonMonth=K.lessonMonth
      end) left join

  teacher on
    Q.teacherID=teacher.teacherID left join
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
  ) as A on
    A.quarterID=Q.quarterID and
    A.lessonMonth=Q.lessonMonth
where
  1=(case
    when Q.requestMonth<concat(date_format(current_date, '%Y-%m'), '-01')=1
    then Q.lessonMonth is not null
    else 1
  end)
group by
  quarterID`
);
const fetchWaitLessonsQuery0 = (
`select
  lesson.quarterID,
  lesson.quarterName,
  lesson.requestMonth as lessonMonth,
  lesson.teacherID,
  lesson.teacherName,
  lesson.lessonMonth is not null as RegCode,
  lesson.lessonEnded,
  case
    when lesson.lessonMonth is null and lesson.teacherID is not null and count(billing.studentID)>0 and lesson.requestMonth=concat(date_format(current_date, '%Y-%m'), '-01')
    then 1
    else 0
  end as isCanBePosted,
  case
    when lesson.lessonEnded=0 and lesson.lessonMonth is not null and (lesson.lessonMonth=concat(date_format(current_date, '%Y-%m'), '-01'))=0
    then 1
    else 0
  end as isCanBeClosed,
  concat('[',group_concat(
    concat('[',case when lesson.lessonMonth is not null then billing.studentID else studentInfo.studentID end, ',[\"',studentInfo.studentName,'\",',case when billing.billingGroup is not null then billing.billingGroup>0 else 0 end, ',', case when billing.billingPrice is not null then billing.billingPrice else 0 end, ',', billing.quarterID is not null,']]')
  ),']') as json,
  count(case
    when billing.billingGroup=0
    then 1
    else null
  end) as singleStudent,
  count(case
    when billing.billingGroup>0
    then 1
    else null
  end) as groupStudent
from
  billing right join
  studentInfo on
    billing.studentID=studentInfo.studentID right join
  (select
    quarter.quarterID,
    quarter.quarterName,
    quarter.lessonMonth as requestMonth,
    lesson.lessonMonth,
    lesson.lessonEnded,
    case
      when teacher.teacherID is not null
      then teacher.teacherID
      else quarter.teacherID
    end as teacherID,
    case
      when teacher.teacherID is not null
      then teacher.teacherName
      else (
        select
          teacherName
        from
          teacher as T
        where
          quarter.teacherID=T.teacherID
      )
    end as teacherName,
    quarter.unused as quarterUnused
  from
    (select
      ? as lessonMonth,
      quarter.*
    from
      quarter
    ) as quarter left join
    lesson on
      quarter.quarterID=lesson.quarterID and
      quarter.lessonMonth=lesson.lessonMonth left join
    teacher on
      lesson.teacherID=teacher.teacherID
  ) as lesson on
    1=(case
      when lesson.lessonMonth is not null
      then (billing.quarterID=lesson.quarterID and billing.lessonMonth=lesson.requestMonth)
      else (studentInfo.quarterID=lesson.quarterID) or (billing.quarterID=lesson.quarterID and billing.lessonMonth=lesson.requestMonth)
    end)
where
  1=(case
    when lesson.requestMonth<concat(date_format(current_date, '%Y-%m'), '-01')=1
    then lesson.requestMonth=lesson.lessonMonth
    else lesson.quarterUnused=0
  end)
group by
  lesson.quarterID`);
async function fetchWaitLessons(
  lessonMonth
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const rows = await conn.query(fetchWaitLessonsQuery, [
      lessonMonth, lessonMonth
    ]);
    await conn.release();
    return rows.map(({ json, ...rest }) => ({ students: JSON.parse(json), ...rest }));
  } catch(err) {
    process.env.ERROR === '1' && console.error(err);
    await conn.release();
    throw err;
  }
}

module.exports = async function(
  req, res
) {
  const lessonMonth = req.params?.lessonMonth ?? null;
  try {
    const rows = await fetchWaitLessons(
      lessonMonth
    );
    if(rows.length === 0) {
      NotFound(res);
    } else {
      OK(res, rows);
    }
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const lessonMonth = process.env?.LM ?? '2020-10-01';
  try {
    const rows = await fetchWaitLessons(
      lessonMonth
    );
    console.log(rows);
  } catch(err) {
    console.error(err);
  }
  pool.end();
})();
