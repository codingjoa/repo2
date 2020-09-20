const { Created, BadRequest } = require('../format.js');

module.exports = function create(pool) { return {
  async quarter(req, res) {
/* @codingjoa
   반을 생성하는 함수: post
   tid: 담당하게 될 선생 id
*/
    const { tid: teacherID } = req.session?.user ?? {};
    const grace = pool.query(
      'insert into quarter(teacherID) values (?)',
      [ teacherID ]
    )
    .then(r => r.insertId ? Created(res, { quarterID: r.insertId }) : BadRequest(res, new Error('정보가 생성되지 읺았습니다.')))
    .catch(e => BadRequest(res, e));
  },
  async student(req, res) {
/* @codingjoa
   새 학생 정보를 등록
   반을 관리할 권한이 있어야 함
*/
    const quarterID = req.body.qid;
    const studentName = req.body.name;
    const studentBirthday = req.body.birthday;
    const studentGender = req.body.gender;
    const studentPhone = req.body.phone;
    const studentEmail = req.body.email;
    const studentAddress = req.body.address;
    pool.query(
      'insert into student(quarterID, studentName, studentBirthday, studentGender, studentPhone, studentEmail, studentAddress) values (?, ?, ?, ?, ?, ?, ?)',
      [ quarterID ?? null, studentName ?? null, studentBirthday ?? null, studentGender ?? null, studentPhone ?? null, studentEmail ?? null, studentAddress ?? null ]
    )
    .then(r => r.insertId ? Created(res, { quarterID: r.insertId }) : BadRequest(res, new Error('정보가 생성되지 읺았습니다.')))
    .catch(e => BadRequest(res, e));
  },
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
  async teacher(req, res, next) {
/* @codingjoa
   POST
   선생님 정보를 새로 생성
   임시 비밀번호는 regeneratePassword로 넘김
   400 BadRequest
*/
    const { name: teacherName, id: teacherAccount } = req.body ?? {};
    pool.query(
      'insert into teacher(teacherName, teacherAccount, teacherPassword) values(?, ?, 0)',
      [ teacherName, teacherAccount ]
    )
    .then(r => ( ( req.next.tid = r.insertId ) > 0 ) ? next() : BadRequest(res, new Error('정보가 생성되지 읺았습니다.')))
    .catch(e => BadRequest(res, e));
  }
}}
