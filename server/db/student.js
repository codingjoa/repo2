
module.exports = function student(pool) {
  return {

  async add(req, res) {
/* @codingjoa
   새 학생 정보를 등록
   반을 관리할 권한이 있어야 함
*/
    const { qid: quarterID, name: studentName, birthday: studentBirthday, gender: studentGender, phone: studentPhone, email: studentEmail, address: studentAddress, uniqueness: studentUniqueness} = req.body ?? {};
    const grace = pool.query(
      'insert into student(quarterID, studentName, studentBirthday, studentGender, studentPhone, studentEmail, studentAddress, studentUniqueness) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [ quarterID ?? null, studentName ?? null, studentBirthday ?? null, studentGender ?? null, studentPhone ?? null, studentEmail ?? null, studentAddress ?? null, studentUniqueness ?? null ]
    )
    .then(r => {
      if(r.affectedRows === 0) throw { message: 'r.affectedRows === 0' };
    });
    grace.then(r => res.json({ complete: true, message: '학생 등록에 성공했습니다.' }))
    .catch(e => res.json({ complete: false, message: '학생 등록에 실패했습니다.', cause: e.message }));
  },
  async delete(req, res) {
/* @codingjoa
   학생을 반에서 제거
   학생을 관리할 권한이 있어야 함
*/
    const { sid: studentID } = req.query ?? {};
    const grace = pool.query(
      'update student SET quarterID=null where studentID=?',
      [ studentID ]
    )
    .then(r => {
      if(r.affectedRows === 0) throw { message: 'r.affectedRows === 0' };
    });
    grace.then(r => res.json({ complete: true, message: '학생 삭제에 성공했습니다.' }))
    .catch(e => res.json({ complete: false, message: '학생 삭제에 실패했습니다.', cause: e.message }));
  },
  async modify(req, res) {
/* @codingjoa
   학생 정보를 수정
   학생을 관리할 권한이 있어야 함

   작업중
*/
    const grace = pool.query(
      'update student set qid=(?), name=(?), age=(?), birthday=(?), gender=(?), phone=(?), email=(?), address=(?), uniqueness=(?) where sid=(?)',
      []
    );
    grace.then(r => res.json({complete: true, message: '학생 수정에 성공했습니다' }))
    .catch(e => res.json({ complete: false, message: '학생 수정에 실패했습니다.', cause: e.message }));
  },
  async fetch(req, res) {
/* @codingjoa
   이 반의 학생 목록을 조회
   반을 관리할 권한이 있어야 함
*/
    const { sid: studentID, qid: quarterID } = req.query ?? {};
    const grace = pool.query(
      'select s.* from student s, quarter q, teacher t where s.quarterID=q.quarterID and q.teacherID=t.teacherID and q.quarterID=?',
      [ quarterID ]
    );
    grace.then(r => res.json({ complete: true, data: r}))
    .catch(e => res.json({ complete: false, message: '학생 조회에 실패했습니다.', cause: e.message }));
  }

  }
};
