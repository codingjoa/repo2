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
    concat('[', K.studentID, ',[\"', K.studentNameDup,'\",', case when K.billingUnpaidCode>0 then 1 when K.billingRefundPrice>0 then 2 else 0 end, ',', case when K.billingRegCode then K.billingPrice else 0 end, ',', K.billingRegCode,']]')
    order by K.studentNameDup
  ),']') as json,
  case
    when Q.lessonRegCode=0 and Q.teacherID is not null and count(K.studentID)>0 and sum(K.billingRegCode)>0 and Q.requestMonth=concat(date_format(current_date, '%Y-%m'), '-01')
    then 1
    else 0
  end as isCanBePosted,
  case
    when Q.lessonEnded=0 and Q.lessonRegCode=1 and (Q.lessonMonth=concat(date_format(current_date, '%Y-%m'), '-01'))=0
    then 1
    else 0
  end as isCanBeClosed,
  count(K.studentID) as totalStudent,
  sum(ifnull(K.billingGroup=0, 0)) as totalSingleStudent,
  sum(ifnull(K.billingGroup>0, 0)) as totalGroupStudent,
  sum(ifnull(K.billingRegCode=1, 0)) as totalBillingRegStudent,
  A.studySize,
  A.studyOkSize,
  sum(ifnull(K.billingPrice, 0) - ifnull(K.billingRefundPrice, 0)) as totalPrice,
  sum(ifnull(K.billingRefundPrice, 0)) as totalRefundPrice
from
  (select
    quarter.quarterID,
    quarter.quarterName,
    lesson.lessonMonth,
    quarter.requestMonth,
    ifnull(lesson.teacherID, quarter.teacherID) as teacherID,
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
    (case
      when quarter.requestMonth<concat(date_format(current_date, '%Y-%m'), '-01')=1
      then lesson.lessonMonth is not null
      else 1
    end) and
    ifnull(lesson.quarterID, quarter.unused=0)>0 and
    (quarter.quarterName like concat('%', ?, '%') or (select teacher.teacherName from teacher where teacher.teacherID=ifnull(lesson.teacherID, quarter.teacherID)) like concat('%', ?, '%'))
  limit ?, ?
  ) as Q left join


  (select
    studentInfo.studentID,
    studentInfo.studentName,
    case
      when Duplicated.isDuplicatedName=1
      then concat(studentInfo.studentName, '(', right(trim(replace(studentInfo.studentPhone, '-', '')), 4), ')')
      else studentInfo.studentName
    end as studentNameDup,
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
    billing.billingUnpaidCode,
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
      studentInfo.studentName=Duplicated.studentName left join
    billing on
      studentInfo.studentID=billing.studentID and
      studentID.requestMonth=billing.lessonMonth
  ) as K on
      1=(case
        when Q.lessonRegCode=0 or Q.lessonEnded=0
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
group by
  quarterID`);

// from 조회는 동명이인 쿼리(동명이인이 많을 때)에서 속도 저하가 발생
// select 조회는 case 계산으로 인해 약 0.03초 속도 저하가 발생
// 학생 603명, 팀 70개, 강사 6명, 입금등록 0개 기준
const fetchWaitLessonsQueryTest = (
`select
  bundle.quarterID,
  bundle.quarterName,
  bundle.lessonMonth,
  bundle.teacherID,
  bundle.teacherName,
  bundle.lessonRegCode,
  bundle.lessonEnded,
  bundle.studySize,
  bundle.studyOkSize,
  bundle.lastStudySize,
  concat('[',group_concat(
    concat(
      '[',
      bundle.studentID,
      ',[\"',
      bundle.studentName,
      '\",',
      ifnull(bundle.billingGroup>0, 0),
      ',',
      ifnull(bundle.billingPrice, 0),
      ',',
      bundle.billingPrice is not null,
      ']]'
    )
    order by
      bundle.studentName asc
  ), ']') as json,
  count(bundle.studentID) as totalStudent,
  sum(ifnull(bundle.billingGroup=0,0)) as totalSingleStudent,
  sum(ifnull(bundle.billingGroup>0,0)) as totalGroupStudent,
  sum(bundle.billingPrice is not null) as totalBillingRegStudent,
  sum(ifnull(bundle.billingPrice, 0)) as totalPrice,
  sum(ifnull(bundle.billingRefundPrice, 0)) as totalRefundPrice,
  case
    when bundle.lessonRegCode=0 and bundle.teacherID is not null and count(bundle.studentID)>0 and count(bundle.studentID)=count(bundle.billingPrice) and bundle.lessonMonth=concat(date_format(current_date, '%Y-%m'), '-01')
    then 1
    else 0
  end as isCanBePosted,
  case
    when bundle.lessonEnded=0 and bundle.lessonRegCode=1 and (bundle.lessonMonth<concat(date_format(current_date, '%Y-%m'), '-01'))
    then 1
    else 0
  end as isCanBeClosed
from

(select
  quarter.quarterID,
  quarter.quarterName,
  quarter.requestMonth as lessonMonth,
  case
    when lesson.quarterID is not null
    then lesson.teacherID
    else quarter.teacherID
  end as teacherID,
  case
    when lesson.quarterID is not null
    then lesson.teacherName
    else quarter.teacherName
  end as teacherName,
  lesson.quarterID is not null as lessonRegCode,
  lesson.lessonEnded,
  lesson.studySize,
  lesson.studyOkSize,
  lessonLast.studySize as lastStudySize,
  case
    when lesson.quarterID is not null
    then billing.studentID
    when billing.quarterID is not null
    then billing.studentID
    else student.studentID
  end as studentID,
  case
    when lesson.quarterID is not null
    then billing.studentNameDup
    when billing.quarterID is not null
    then billing.studentNameDup
    else student.studentNameDup
  end as studentName,
  billing.billingGroup,
  billing.billingPrice,
  billing.billingRefundPrice,
  billing.quarterID is not null as billingRegCode
from
(select
  quarter.*,
  teacher.teacherName,
  concat(date_format(?, '%Y-%m'), '-01') as requestMonth
from
  quarter left join
  teacher on
    quarter.teacherID=teacher.teacherID
) as quarter left join
(select
  lesson.*,
  count(distinct study.studyWeek) as studySize,
  count(distinct case
    when checking.checkModified is not null
    then checking.studyWeek
    else null
  end) as studyOkSize,
  teacher.teacherName
from
  lesson left join
  teacher on
    lesson.teacherID=teacher.teacherID left join
  study on
    lesson.quarterID=study.quarterID and
    lesson.lessonMonth=study.lessonMonth left join
  checking on
    study.quarterID=checking.quarterID and
    study.lessonMonth=checking.lessonMonth
  group by
    lesson.quarterID,
    lesson.lessonMonth
) as lesson on
  quarter.quarterID=lesson.quarterID and
  quarter.requestMonth=lesson.lessonMonth left join
(select
  studentID.studentID,
  studentInfo.studentName,
  case
    when Duplicated.isDuplicatedName=1
    then concat(studentInfo.studentName, '(', right(trim(replace(studentInfo.studentPhone, '-', '')), 4), ')')
    else studentInfo.studentName
  end as studentNameDup,
  studentInfo.quarterID
from
  studentID left join
  studentInfo on
    studentID.studentID=studentInfo.studentID left join
  (select
    studentInfo.studentName,
    1 as isDuplicatedName
  from
    studentInfo
  group by
    studentInfo.studentName
  having
    count(studentInfo.studentName)>1
  ) Duplicated on
    studentInfo.studentName=Duplicated.studentName
where
  studentID.unused=0
) as student on
  quarter.quarterID=student.quarterID left join
(select
  billing.quarterID,
  billing.lessonMonth,
  studentInfo.studentID,
  studentInfo.studentName,
  billing.billingGroup,
  billing.billingPrice,
  billing.billingRefundPrice,
  case
    when Duplicated.isDuplicatedName=1
    then concat(studentInfo.studentName, '(', right(trim(replace(studentInfo.studentPhone, '-', '')), 4), ')')
    else studentInfo.studentName
  end as studentNameDup
from
  billing left join
  studentInfo on
    billing.studentID=studentInfo.studentID left join
  (select
    studentInfo.studentName,
    1 as isDuplicatedName
  from
    studentInfo
  group by
    studentInfo.studentName
  having
    count(studentInfo.studentName)>1
  ) Duplicated on
    studentInfo.studentName=Duplicated.studentName
) as billing on
  quarter.quarterID=billing.quarterID and
  quarter.requestMonth=billing.lessonMonth and
  student.studentID=billing.studentID left join
(select
  lesson.quarterID,
  lesson.lessonMonth,
  count(study.studyWeek) as studySize
from
  (select
    lesson.quarterID,
    max(lesson.lessonMonth) as lessonMonth
  from
    lesson
  group by
    lesson.quarterID
  ) as lesson left join
  study on
    lesson.quarterID=study.quarterID and
    lesson.lessonMonth=study.lessonMonth
group by
  lesson.quarterID
) lessonLast on
  quarter.quarterID=lessonLast.quarterID
where
  case
    when concat(date_format(quarter.requestMonth, '%Y-%m'), '-01')<concat(date_format(current_date, '%Y-%m'), '-01')
    then lesson.quarterID is not null
    else quarter.unused=0
  end and (
    quarter.quarterName like concat('%', ?, '%') or
    case
      when lesson.quarterID is not null
      then lesson.teacherName
      when quarter.teacherID is not null
      then quarter.teacherName
      else null
    end like concat('%', ?, '%')
  )
order by
  quarter.quarterID



) as bundle
group by
  bundle.quarterID
limit ?, ?`);
const fetchWaitLessonsLenQuery = (
`select
  count(quarter.quarterID) as total
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
  case
    when quarter.requestMonth<concat(date_format(current_date, '%Y-%m'), '-01')
    then lesson.quarterID is not null
    else quarter.unused=0
  end and
  (quarter.quarterName like concat('%', ?, '%') or (select teacher.teacherName from teacher where teacher.teacherID=ifnull(lesson.teacherID, quarter.teacherID)) like concat('%', ?, '%'))`);
async function fetchWaitLessons(
  lessonMonth,
  offset,
  limit,
  keyword
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const info = await conn.query(fetchWaitLessonsLenQuery, [
      lessonMonth, keyword, keyword
    ]);
    if(!info?.length) {
      NotFound(res);
    }
    const total = info[0].total;
    const totalPage = Math.ceil(total / limit);
    const rows = await conn.query(fetchWaitLessonsQuery, [
      lessonMonth, keyword, keyword, offset, limit, lessonMonth
    ]);
    await conn.release();
    const editedRows = rows.map(({ json, ...rest }) => ({ students: JSON.parse(json), ...rest }));
    return {
      total,
      totalPage,
      rows: editedRows
    };
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
  const offset = req.query.offset - 0 ?? 0; // 1.5 or later
  const size = req.query.size - 0 ?? 10; // 1.5 or later
  const keyword = req.query.keyword ?? ''; // 1.5 or later
  try {
    const result = await fetchWaitLessons(
      lessonMonth, offset, size, keyword
    );
    if(result.rows.length === 0) {
      NotFound(res);
    } else {
      OK(res, result);
    }
  } catch(err) {
    BadRequest(res, err);
  }
};
module.id === require.main.id && (async () => {
  const lessonMonth = process.env?.LM ?? '2020-10-01';
  try {
    const rows = await fetchWaitLessons(
      lessonMonth, '', 0, 20
    );
    console.log(rows);
  } catch(err) {
    console.error(err);
  }
  pool.end();
})();
