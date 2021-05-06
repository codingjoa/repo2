const { OK, NotFound, InternalError } = require('../format');
const { pool } = require('../poolManager');
const fetchBillingRefundsQuery = (
`select
  studentInfo.studentID,
  studentInfo.studentName,
  trim(replace(studentInfo.studentPhone, '-', '')) as studentPhone,
  billing.quarterID,
  quarter.quarterName,
  billing.lessonMonth,
  billing.billingPrice,
  billing.billingRefundPrice,
  billing.billingRefundAt,
  billing.billingRefundMiddleCode
from
  billing left join
  studentInfo on
    billing.studentID=studentInfo.studentID left join
  quarter on
    billing.quarterID=quarter.quarterID
where
  billing.billingRefundPrice is not null and
  date_format(?, '%Y-%m')=date_format(billing.lessonMonth, '%Y-%m') and
  (quarter.quarterName like concat('%', ?, '%') or studentInfo.studentName like concat('%', ?, '%'))
order by
  studentInfo.studentName asc
limit ?, ?`);
const fetchBillingRefundsLenQuery = (
`select
  count(*) as total
from
  billing left join
  studentInfo on
    billing.studentID=studentInfo.studentID left join
  quarter on
    billing.quarterID=quarter.quarterID
where
  billing.billingRefundPrice is not null and
  date_format(?, '%Y-%m')=date_format(billing.lessonMonth, '%Y-%m') and
  (quarter.quarterName like concat('%', ?, '%') or studentInfo.studentName like concat('%', ?, '%'))`);
async function fetchBillingRefunds(
  lessonMonth,
  offset,
  limit,
  keyword
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const info = await conn.query(fetchBillingRefundsLenQuery, [
      lessonMonth, keyword, keyword
    ]);
    if(!info?.length) {
      NotFound(res);
    }
    const total = info[0].total;
    const totalPage = Math.ceil(total / limit);
    const rows = await conn.query(fetchBillingRefundsQuery, [
      lessonMonth, keyword, keyword, offset, limit
    ]);
    await conn.release();
    const editedRows = rows.map(
      ({ studentPhone, ...rest }) => ({
        // 전화번호 하이픈 추가 출처: http://blog.naver.com/PostView.nhn?blogId=mankeys&logNo=221054049295&categoryNo=0&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=postList
        studentPhone: studentPhone.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3'),
        ...rest
      })
    );
    return {
      total,
      totalPage,
      rows: editedRows
    };
  } catch(err) {
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
    const result = await fetchBillingRefunds(
      lessonMonth, offset, size, keyword
    );
    if(result.rows.length === 0) {
      NotFound(res);
    } else {
      OK(res, result);
    }
  } catch(err) {
    InternalError(res, err);
  }
};
