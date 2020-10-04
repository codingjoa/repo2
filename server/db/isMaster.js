const { OK, BadRequest, Unauthorized, Forbidden } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   관리자 권한인지 확인하는 쿼리
*/

module.exports = async function(
  req, res
) {
  const teacherID = req.session?.user?.teacherID;
  pool.query(
    'select teacherOp from teacher where teacherID=?',
    [ teacherID ]
  )
  .then(r => {
    if(r[0].teacherOp === 0 && Forbidden(res)) return;
    next();
  })
  .catch(e => BadRequest(res, e));
};



function permission(pool) { return {
  async editableStudent(req, res, next) {
/* @codingjoa
   선생이 이 학생을 관리할 권한이 있는지 확인
   403 Forbidden
*/
    const studentID = req.params.stid ?? req.query.stid ?? req.body.stid;
    const { tid: teacherID } = req.session.user ?? {};
    pool.query(
      'select t.teacherID, q.quarterID, s.studentId from teacher t, quarter q, student s where t.teacherID=q.teacherID and q.quarterID=s.quarterID and t.teacherID=? and s.studentID=?',
      [ teacherID, studentID ]
    )
    .then(r => {
      if(r.length === 0 && Forbidden(res)) return;
      next();
    })
    .catch(e => BadRequest(res, e));
  },
  async editableQuarter(req, res, next) {
/* @codingjoa
   선생이 이 반을 관리할 권한이 있는지 확인
   403 Forbidden
*/
console.log(req.params, req.query, req.body);
    const quarterID = req.params.qid ?? req.query.qid ?? req.body.qid;
    const { tid: teacherID } = req.session.user ?? {};
    pool.query(
      'select t.teacherID, q.quarterID from teacher t, quarter q where t.teacherID=q.teacherID and q.teacherID=? and q.quarterID=?',
      [ teacherID, quarterID ]
    )
    .then(r => {
      if(r.length === 0 && Forbidden(res)) return;
      next();
    })
    .catch(e => BadRequest(res, e));
  },
  async editableTeacher(req, res, next) {
/* @codingjoa
   선생이 선생을 관리할 권한이 있는지 확인
   403 Forbidden
*/
    const { tid: teacherID } = req.session.user ?? {};
    const grace = pool.query(
      'select teacherOp from teacher where teacherID=?',
      [ teacherID ]
    )
    .then(r => {
      if(r[0].teacherOp === 0 && Forbidden(res)) return;
      next();
    })
    .catch(e => BadRequest(res, e));
  },
  editableSession(req, res, next) {
/* @codingjoa
   로그인 되어 있는지 확인
   401 Unauthorized
*/
    const { user } = req?.session;
    if(!user && Unauthorized(res)) return;
    next(); 
  }
}};
