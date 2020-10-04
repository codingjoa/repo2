
const { OK, BadRequest, NotFound } = require('../format.js');

module.exports = function fetch(pool) { return {

  async students(req, res) {
/* @codingjoa
   이 반의 학생 목록을 조회
   반을 관리할 권한이 있어야 함
*/
    const quarterID = req.params.qid;
    const grace = pool.query(
      'select s.* from student s, quarter q, teacher t where s.quarterID=q.quarterID and q.teacherID=t.teacherID and q.quarterID=?',
      [ quarterID ?? null ]
    )
    .then(r => {
      !r.length && NotFound(res);
      r.length && OK(res, r);
    })
    .catch(e => BadRequest(res, e));
  },
  async study(req, res) {
/* @codingjoa
   반번호와 날짜에 부합하는 출석부 ID(studyID)를 구함
*/
    const { qid: quarterID, date: studyDate } = req.query ?? {};
    pool.query(
      'select s.studyID, c.checkingID, s.teacherID, st.studentID, st.studentName, s.studyDate, c.checkModified, c.checkOk from study s, checking c, student st where s.studyID=c.studyID and c.studentID=st.studentID and s.studyDate=? and s.quarterID=?',
      [ studyDate ?? null, quarterID ?? null]
    )
    .then(r => {
      !r.length && NotFound(res);
      r.length && OK(res, r);
    })
    .catch(e => BadRequest(res, e));
  },
  async checking(req, res) {
/* @codingjoa
   출석부 ID(studyID)에 부합하는 학생 목록을 조회함
*/
/*
    const studyID = req.params.sid;
    const grace = pool.query(
      'select s.studyID, c.checkingID, s.teacherID, st.studentID, st.studentName, s.studyDate, c.checkModified, c.checkOk from study s, checking c, student st where s.studyID=c.studyID and c.studentID=st.studentID and s.studyDate=? and s.quarterID=?',
      [ studyDate ?? null, quarterID ?? null]
    )
    .then(r => {
      !r.length && NotFound(res);
      r.length && OK(res, r);
    })
    .catch(e => BadRequest(res, e));
*/
  },

}}
