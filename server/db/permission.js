
module.exports = function permission(pool) {
  return {

  async editableStudent(req, res, next) {
/* @codingjoa
   선생이 이 학생을 관리할 권한이 있는지 조사
*/
    const studentID = req.query?.sid ?? req.body?.sid;
    const { tid: teacherID } = req.session.user ?? {};
    const grace = await pool.query(
      'select t.teacherID, q.quarterID, s.studentId from teacher t, quarter q, student s where t.teacherID=q.teacherID and q.quarterID=s.quarterID and t.teacherID=? and s.studentID=?',
      [ teacherID, studentID ]
    )
    .then(r => {
      if(r.length === 0) throw { message: '이 학생을 관리할 권한이 없습니다.'};
    })
    .then(next)
    .catch(e => res.json({ complete: false, message: e.message }))
  },
  async editableQuarter(req, res, next) {
/* @codingjoa
   선생이 이 반을 관리할 권한이 있는지 조사
*/
    const quarterID = req.query?.qid ?? req.body?.qid;
    const { tid: teacherID } = req.session.user ?? {};
    const grace = await pool.query(
      'select t.teacherID, q.quarterID from teacher t, quarter q where t.teacherID=q.teacherID and q.teacherID=? and q.quarterID=?',
      [ teacherID, quarterID ]
    )
    .then(r => {
      if(r.length === 0) throw { message: '이 반을 관리할 권한이 없습니다.'};
    })
    .then(next)
    .catch(e => res.json({ complete: false, message: e.message }))
  },
  async editableTeacher(req, res, next) {
/* @codingjoa
   선생이 선생을 관리할 권한이 있는지 조사
*/
    const { tid: teacherID } = req.session.user ?? {};
    const grace = pool.query(
      'select teacherOp from teacher where teacherID=?',
      [ teacherID ]
    )
    .then(r => {
      if(r[0].teacherOp === 0) throw { message: '선생님을 관리할 권한이 없습니다.'};
    })
    
    await grace.then(next)
    .catch(e => res.json({ complete: false, message: e.message, cause: e.message }))
  }

  };
};
