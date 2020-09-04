
module.exports = function permission(pool) {
  return {

  async editableStudent(req, res, next) {
/* @codingjoa
   선생이 이 학생을 관리할 권한이 있는지 조사
*/
    const { sid: studentID } = req.body;
    const { tid: teacherID } = req.session.user;
    const grace = await pool.query(
      'select t.teacherID, q.quarterID, s.studentId from teacher t, quarter q, student s where t.teacherID=q.teacherID and q.quarterID=s.quarterID and t.teacherID=? and s.studentID=?',
      [ teacherID, studentID ]
    );
    if(grace.length === 0) res.json({ complete: false, message: '이 학생을 관리할 권한이 없습니다 '});
    else next();
  },
  async editableQuarter(req, res, next) {
/* @codingjoa
   선생이 이 반을 관리할 권한이 있는지 조사
*/
    const { sid: quartetID } = req.body;
    const { tid: teacherID } = req.session.user;
    const grace = await pool.query(
      'select t.teacherID, q.quarterID from teacher t, quarter q where t.teacherID=q.teacherID and q.teacherID=? and q.quarterID=?',
      [ teacherID, quarterID ]
    );
    if(grace.length === 0) res.json({ complete: false, message: '이 학생을 관리할 권한이 없습니다 '});
    else next();
  }

  };
};
