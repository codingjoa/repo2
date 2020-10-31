const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   학생 정보를 수정
*/

module.exports = async function(
  req, res
) {
  const studentID = req.params.studentID ?? null;
  const studentName = req.body.studentName ?? null;
  const studentBirthday = req.body.studentBirthday ?? null;
  const studentGender = req.body.studentGender ?? null;
  const studentPhone = req.body.studentPhone ?? null;
  const studentEmail = req.body.studentEmail ?? null;
  const studentAddress = req.body.studentAddress ?? null;
  pool.query(`update studentInfo set
    studentName=(?),
    studentBirthday=(?),
    studentGender=(?),
    studentPhone=(?),
    studentEmail=(?),
    studentAddress=(?)
    where studentID=(?)`,
    [ studentName,
      studentBirthday,
      studentGender,
      studentPhone,
      studentEmail,
      studentAddress,
      studentID
    ]
  )
  .then(r => {
    !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
    r.affectedRows && OK(res);
  })
  .catch(e => BadRequest(res, e));
};
