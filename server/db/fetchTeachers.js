const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   GET
   선생님 목록을 반환
*/

module.exports = async function(
  req, res
) {
  pool.query(`
    select teacherID, teacherName, teacherOp, teacherAccount from teacher`
  )
  .then(r => {
    r.length && OK(res, r);
    !r.length && NotFound(res);
  })
  .catch(e => BadRequest(res, e));
/*
    const selectQuery = 'select t.teacherID, teacherName, teacherOp, teacherAccount, slen, qlen, stlen';
    const fromQuery = 'from teacher t, (select t.teacherID, count(studyID) as slen from study s right join teacher t on s.teacherID=t.teacherID group by teacherID) s, (select t.teacherID, count(quarterID) as qlen from quarter q right join teacher t on q.teacherID=t.teacherID group by teacherID) q, (select t.teacherID, count(studentID) as stlen from student s right join quarter q on s.quarterID=q.quarterID right join teacher t on q.teacherID=t.teacherID group by teacherID) st';
    const whereQuery = 'where t.teacherID=s.teacherID and t.teacherID=q.teacherID and t.teacherID=st.teacherID';
    pool.query(`${selectQuery} ${fromQuery} ${whereQuery}`)
    .then(r => {
      r.length && OK(res, r);
      !r.length && NotFound(res);
    })
    .catch(e => BadRequest(res, e));
*/
};

/*
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
*/
