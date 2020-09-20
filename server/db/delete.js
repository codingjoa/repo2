const { OK, BadRequest } = require('../format.js');

// NoContent로 보내면 axios 프로미스에서 result가 없어서 후 처리가 안됨.
module.exports = function remove(pool) { return {
  async quarter(req, res) {
/* @codingjoa
   반 정보를 삭제
*/
    const quarterID = req.params.qid;
    pool.query(
      'delete from quarter where quarterID=?',
      [ quarterID ?? null ]
    )
    .then(r => {
      !r.affectedRows && BadRequest(res, new Error('삭제되지 않았습니다.'));
      r.affectedRows && OK(res);
    })
    .catch(e => BadRequest(res, e));
  },
  async teacher(req, res) {
/* @codingjoa
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
