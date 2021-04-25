const { Created, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   새 학생 정보를 등록
   반을 관리할 권한이 있어야 함


*/

module.exports = async function(
  req, res
) {
  const studentName = req.body.studentName;
  //const studentBirthday = req.body.studentBirthday ?? null;
  //const studentGender = req.body.studentGender ?? null;
  const studentPhone = req.body.studentPhone;
  //const studentEmail = req.body.studentEmail ?? null;
  //const studentAddress = req.body.studentAddress ?? null;
  const studentID = await pool.query(
    'insert into studentID values()'
  )
  .then(r => r.affectedRows ? r.insertId : null)
  .catch(e => BadRequest(res, e));
  if(studentID === null) return BadRequest(res, new Error('id 생성 오류'));
  pool.query(`
    insert into studentInfo(
      studentID,
      studentName,
      studentPhone
    ) values (
      ?, ?, ?
    )`,[
      studentID ?? null,
      studentName ?? null,
      //studentBirthday ?? null,
      //studentGender ?? null,
      studentPhone ?? null
      //studentEmail ?? null,
      //studentAddress ?? null
    ]
  )
  .then(r => r.affectedRows ? Created(res) : BadRequest(res, new Error('학생 정보가 생성되지 읺았습니다.')))
  .catch(e => BadRequest(res, e));
};
