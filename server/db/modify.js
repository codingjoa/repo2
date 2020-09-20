const { OK, BadRequest } = require('../format.js');

module.exports = function modify(pool) { return {
  async quarter(req, res) {
/* @codingjoa
   선생이 자신이 관리하는 반의 이름을 변경합니다.
*/
    const quarterID = req.params.qid;
    const quarterName = req.body.name;
    pool.query(
      'update quarter set quarterName=? where quarterID=?',
      [ quarterName ?? null, quarterID ?? null ]
    )
    .then(r => {
      !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
      r.affectedRows && OK(res);
    })
    .catch(e => BadRequest(res, e));
  },
  async studentUniqueness(req, res) {
    const studentID = req.params.stid;
    const studentUniqueness = req.body.uniqueness;
    pool.query(
      'update student set studentUniqueness=? where studentID=?',
      [ studentUniqueness ?? null, studentID ?? null ]
    )
    .then(r => {
      !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
      r.affectedRows && OK(res);
    })
    .catch(e => BadRequest(res, e));
  },
  async student(req, res) {
/* @codingjoa
   학생 정보를 수정
   학생을 관리할 권한이 있어야 함

   작업중
*/
    const grace = pool.query(
      'update student set qid=(?), name=(?), age=(?), birthday=(?), gender=(?), phone=(?), email=(?), address=(?), uniqueness=(?) where sid=(?)',
      []
    )
    .then(r => {
      !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
      r.affectedRows && OK(res);
    })
    .catch(e => BadRequest(res, e));
  },
  async teacher(req, res) {
    const teacherID = req.params.tid;
    const teacherName = req.body.name;
    pool.query(
      'update teacher set teacherName=? where teacherID=?',
      [ teacherName ?? null, teacherID ?? null ]
    )
    .then(r => {
      !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
      r.affectedRows && OK(res);
    })
    .catch(e => BadRequest(res, e));
// delete from teacher where teacherID=?
  }
}}
