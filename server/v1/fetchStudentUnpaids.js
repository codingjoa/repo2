const { OK, NotFound, InternalError } = require('../format');
const { pool } = require('../poolManager');
const fetchStudentUnpaidsQuery = (
`select
  studentInfo.studentID,
  studentInfo.studentName,
  trim(replace(studentInfo.studentPhone, '-', '')) as studentPhone,
  billing.quarterID,
  quarter.quarterName,
  billing.lessonMonth,
  billing.billingPrice,
  billing.billingUnpaidCode,
  lesson.quarterID is not null as lessonRegCode
from
  billing left join
  lesson on
    billing.quarterID=lesson.quarterID and
    billing.lessonMonth=lesson.lessonMonth left join
  studentInfo on
    billing.studentID=studentInfo.studentID left join
  quarter on
    billing.quarterID=quarter.quarterID
where
  billing.billingUnpaidCode>0
order by
  studentInfo.studentName asc,
  billing.lessonMonth asc`);
async function fetchStudentUnpaids() {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const rows = await conn.query(fetchStudentUnpaidsQuery);
    const editedRows = rows.map(
      ({ studentPhone, ...rest }) => ({
        // 전화번호 하이픈 추가 출처: http://blog.naver.com/PostView.nhn?blogId=mankeys&logNo=221054049295&categoryNo=0&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=postList
        studentPhone: studentPhone.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3'),
        ...rest
      })
    );
    await conn.commit();
    await conn.release();
    return editedRows;
  } catch(err) {
    await conn.rollback();
    await conn.release();
    throw err;
  }
}
module.exports = async function(
  req, res
) {
  try {
    const rows = await fetchStudentUnpaids();
    !rows.length && NotFound(res);
    rows.length && OK(res, rows);
  } catch(err) {
    InternalError(res, err);
  }
};
