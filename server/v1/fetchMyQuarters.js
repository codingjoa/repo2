const { OK, NotFound, InternalError } = require('../format');
const { pool } = require('../poolManager');
const fetchMyQuartersQuery = (
`select
  quarter.quarterID,
  quarter.quarterName,
  studentInfo.studentID,
  studentInfo.studentName,
  concat('[',group_concat(
    concat('[', studentInfo.studentID, ',"', studentInfo.studentNameDup, '"]')
    order by studentInfo.studentNameDup
  ),']') as json
from
  quarter left join
  (select
    studentInfo.*,
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
  ) as studentInfo on
    quarter.quarterID=studentInfo.quarterID
where
  quarter.teacherID=? and
  quarter.quarterName like concat('%', ?, '%')
group by
  quarter.quarterID
limit ?, ?`);
const fetchMyQuartersLenQuery = (
`select
  count(*) as total
from
  quarter
where
  quarter.teacherID=? and
  quarter.quarterName like concat('%', ?, '%')`);
async function fetchMyQuarters(
  teacherID,
  keyword,
  offset,
  limit
) {
  const conn = await pool.getConnection();
  try {
    const info = await conn.query(fetchMyQuartersLenQuery, [
      teacherID, keyword
    ]);
    if(!info?.length) {
      NotFound(res);
    }
    const total = info[0].total;
    const totalPage = Math.ceil(total / limit);
    const rows = await conn.query(fetchMyQuartersQuery, [
      teacherID,
      keyword,
      offset,
      limit
    ]);
    await conn.release();
    const editedRows = rows.map(({ json, ...rest }) => ({ students: JSON.parse(json), ...rest }));
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
  const teacherID = req.session?.tid;
  const offset = req.query.offset - 0;
  const size = req.query.size - 0;
  const keyword = req.query.keyword ?? '';
  try {
    const result = await fetchMyQuarters(
      teacherID,
      keyword,
      offset,
      size
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
