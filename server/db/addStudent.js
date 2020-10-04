const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   새 학생 정보를 등록
   반을 관리할 권한이 있어야 함


insert into studentInfo (
  
) values (

);

*/

module.exports = async function(
  req, res
) {
  const studentName = req.body.name;
  const studentBirthday = req.body.birthday;
  const studentGender = req.body.gender;
  const studentPhone = req.body.phone;
  const studentEmail = req.body.email;
  const studentAddress = req.body.address;
  pool.query(
    'insert into studentID values()'
  )
  .then(r => OK(res, r))
  .catch(e => BadRequest(res, e));

/*
  pool.query(
    'insert into student(quarterID, studentName, studentBirthday, studentGender, studentPhone, studentEmail, studentAddress) values (?, ?, ?, ?, ?, ?, ?)',
    [ quarterID ?? null, studentName ?? null, studentBirthday ?? null, studentGender ?? null, studentPhone ?? null, studentEmail ?? null, studentAddress ?? null ]
  )
*/
  //.then(r => r.insertId ? Created(res, { quarterID: r.insertId }) : BadRequest(res, new Error('정보가 생성되지 읺았습니다.')))
};
