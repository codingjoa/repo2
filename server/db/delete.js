const { OK, BadRequest } = require('../format.js');

module.exports = function remove(pool) { return {
  async teacher(req, res) {
/* @codingjoa
   DELETE
   선생님 정보를 삭제
*/
    const teacherID = req.params.tid;
    pool.query(
      'delete from teacher where teacherID=?',
      [ teacherID ?? null ]
    )
    .then(r => {
      !r.affectedRows && BadRequest(res, new Error('삭제되지 않았습니다.'));
      r.affectedRows && OK(res);
    })
    .catch(e => BadRequest(res, e));
  },
  async student(req, res) {
/* @codingjoa
   학생을 반에서 제거
   학생을 관리할 권한이 있어야 함
*/
    const studentID = req.params?.stid;
    const grace = pool.query(
      'update student SET quarterID=null where studentID=?',
      [ studentID ]
    )
    .then(r => {
      !r.affectedRows && BadRequest(res, new Error('삭제되지 않았습니다.'));
      r.affectedRows && OK(res);
    })
    .catch(e => BadRequest(res, e));
  },
}}
