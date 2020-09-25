
const { OK, BadRequest, NotFound } = require('../format.js');

module.exports = function fetch(pool) { return {
  async quarters(req, res) {
/* @codingjoa
   선생이 자신이 담당하는 반의 목록을 조회합니다.
*/
    const teacherID = req.session?.user?.tid;
    pool.query(
      'select teacherID, quarterID, quarterName from quarter where teacherID=?',
      [ teacherID ?? null ]
    )
    .then(r => {
      !r.length && NotFound(res);
      r.length && OK(res, r);
    })
    .catch(e => BadRequest(res, e));
  },
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
  async teachers(req, res) {
/* @codingjoa
   GET
   선생님 정보를 출력
*/
    const selectQuery = 'select t.teacherID, teacherName, teacherOp, teacherAccount, slen, qlen, stlen';
    const fromQuery = 'from teacher t, (select t.teacherID, count(studyID) as slen from study s right join teacher t on s.teacherID=t.teacherID group by teacherID) s, (select t.teacherID, count(quarterID) as qlen from quarter q right join teacher t on q.teacherID=t.teacherID group by teacherID) q, (select t.teacherID, count(studentID) as stlen from student s right join quarter q on s.quarterID=q.quarterID right join teacher t on q.teacherID=t.teacherID group by teacherID) st';
    const whereQuery = 'where t.teacherID=s.teacherID and t.teacherID=q.teacherID and t.teacherID=st.teacherID';
    pool.query(`${selectQuery} ${fromQuery} ${whereQuery}`)
    .then(r => {
      r.length && OK(res, r);
      !r.length && NotFound(res);
    })
    .catch(e => BadRequest(res, e));
  },
  async me(req, res) {
    const teacherID = req.session?.user?.tid;
    const selectQuery = 'select t.teacherID, teacherName, teacherOp, teacherAccount, teacherModifiedPassword, slen, qlen, stlen';
    const fromQuery = 'from teacher t, (select t.teacherID, count(studyID) as slen from study s right join teacher t on s.teacherID=t.teacherID group by teacherID) s, (select t.teacherID, count(quarterID) as qlen from quarter q right join teacher t on q.teacherID=t.teacherID group by teacherID) q, (select t.teacherID, count(studentID) as stlen from student s right join quarter q on s.quarterID=q.quarterID right join teacher t on q.teacherID=t.teacherID group by teacherID) st';
    const whereQuery = 'where t.teacherID=s.teacherID and t.teacherID=q.teacherID and t.teacherID=st.teacherID';
    pool.query(
      `${selectQuery} ${fromQuery} ${whereQuery} and t.teacherID=?`,
      [ teacherID ?? null ]
    )
    .then(r => {
      r.length && OK(res, r);
      !r.length && NotFound(res);
    })
    .catch(e => BadRequest(res, e));
  }
}}
