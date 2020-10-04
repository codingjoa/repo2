const { OK, BadRequest } = require('../format.js');

// NoContent로 보내면 axios 프로미스에서 result가 없어서 후 처리가 안됨.
module.exports = function remove(pool) { return {

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
