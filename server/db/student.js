
module.exports = function student() {
  return {

  async add(req, res) {
/* @codingjoa
   새 학생 정보를 등록
   반을 관리할 권한이 있어야 함
*/
    const { qid: quarterID, name: studentName, birthday: studentBirthday, gender: studentGender, phone: studentPhone, address: studentAddress, uniqueness: studentUniqueness} = req.body;
    const values = [qid, name, age, birthday, gender, phone, email, address, uniqueness ];
    const grace = await pool.query(
      'insert into student(quarterID, studentName, studentBirthday, studentGender, studentPhone, studentEmail, studentAddress, studentUniqueness) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [ quarterID, studentName, studentBirthday, studentGender, studentPhone, studentEmail, studentAddress, studentUniqueness ]
    )
    .then(r => ({complete: true, data: r }))
    .catch(e => ({ complete: false, message: '학생 등록에 실패했습니다.' }));
    res.json(grace);
  },
  async delete(req, res) {
/* @codingjoa
   학생을 반에서 제거
   학생을 관리할 권한이 있어야 함
*/
    const { sid: studentID } = req.body;
    const grace = await pool.query(
      'update student SET student=null where studentID=?',
      [ studnetID ]
    )
    .then(r => ({complete: true, message: '학생 삭제에 성공했습니다' }))
    .catch(e => ({ complete: false, message: '학생 삭제에 실패했습니다.' }));
    res.json(grace);
  },
  //어디서 받아와야하는건데 ..? express에서 하는방법..? api/customer 이런 곳에서 받아와야 하는거 아닌가요..?
  //궁금해서 일단 쿼리분은 적어봤는데.. 그 받아오는걸 모르겠어요..
  async modify(req, res) {
/* @codingjoa
   학생 정보를 수정
   학생을 관리할 권한이 있어야 함
*/
    const grace = await pool.query(
      'update student set qid=(?), name=(?), age=(?), birthday=(?), gender=(?), phone=(?), email=(?), address=(?), uniqueness=(?) where sid=(?)',
      []
    )
    .then(r => ({complete: true, message: '학생 수정에 성공했습니다' }))
    .catch(e => ({ complete: false, message: '학생 수정에 실패했습니다.' }));
    res.json(grace);
  },
  async fetch(req, res) {
/* @codingjoa
   이 반의 학생 목록을 조회
   반을 관리할 권한이 있어야 함
고치는 중
*/
/*
    const { sid: studentID, qid: quarterID } = req.body;
    const { tid: teacherID } = req.session.user;
    const griace = await pool.query('select * from student s, quarter q, teacher t where s.quarterID studentID=');
    return await promise;
*/
  }

  }
};
