const { Created, BadRequest } = require('../format.js');

module.exports = function create(pool) { return {


  async study(req, res) {
/* @codingjoa
   출석부를 만듬
*/
    const { qid: quarterID, date: studyDate } = req.body ?? {};
    const { tid: teacherID } = req.session?.user ?? {};
    const grace = pool.query(
      'select count(st.studentID) from quarter q, student st where q.quarterID=st.quarterID and q.quarterID=?',
      [ quarterID ]
    )
    .then(r => {
      if(r[0]['count(st.studentID)'] === 0) throw { message: '반에 소속된 학생이 없어서 출석부를 만들 수 없음.' };
    })
    .then(async r => {
      return await pool.query(
        'insert into study(teacherID, quarterID, studyDate) values(?, ?, ?)',
        [ teacherID, quarterID, studyDate ?? null ]
      );
    })
    .then(r => {
      if(r.affectedRows === 0) throw { message: '수업 생성에 실패하였음' };
      return r.insertId;
    })
    .then(async studyID => {
      return await pool.query(
        'insert into checking(studyID, studentID) select s.studyID, st.studentID from study s, student st where s.quarterID=st.quarterID and s.studyID=?',
        [ studyID ]
      );
    })
    .then(r => {
      if(r.affectedRows === 0) throw { message: '학생 목록 복사에 실패하였음' };
    });
    await grace.then(r => res.json({ complete: true, message: '출석부 생성에 성공했습니다.', data: r }))
    .catch(e => res.json({ complete: false, message: '출석부 생성에 실패했습니다.', cause: e.message }));
  },
  