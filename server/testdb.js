const users = {
  async add(req, res) {
    const {qid: quarterID, name : studentName, birthday: studentBirthday, gender: studentGender, phone: studentPhone, email: studentEmail, address: studentAddress, uniqueness: studentUniqueness} = req.body;
    const grace = await pool.query({
    namedPlaceholders: true,
    sql:'insert into student values (null, quarterID=:quarterID, studentName=:studentName, studentBirthday=:studentBirthday, studentGender=:studentGender, studentPhone=:studentPhone, studentEmail=:studentEmail, studentAddress=:studentAddress, studentUniqueness=:studentUniqueness, null, null)';
  },{quarterID, studentName, studentBirthday, studentGender, studentPhone, studentEmail, studentAddress, studentUniqueness})
  .then(r => ({complete: true, message: '학생 추가에 성공했습니다.' }))
  .catch(e => ({ complete: false, message: '학생 추가에 실패했습니다.' }));
  res.json(grace);
},
  async del(req, res) {
    const {sid: studentID} = req.body;
    const grace = await pool.query({
    namedPlaceholders: true,
    sql:'update student set quarterID=null where studentID= :studentID';
  },{studentID})
  .then(r => ({complete: true, message: '학생 삭제에 성공했습니다.' }))
  .catch(e => ({ complete: false, message: '학생 삭제에 실패했습니다.' }));
  res.json(grace);
  },
  async modify(req, res) {
    const {qid: quarterID, name : studentName, birthday: studentBirthday, gender: studentGender, phone: studentPhone, email: studentEmail, address: studentAddress, uniqueness: studentUniqueness, sid: studentID,} = req.body;
    const grace = await pool.query({
    namedPlaceholders: true,
    sql:'update student set quarterID=:quarterID, studentName=:studentName, studentBirthday=:studentBirthday, studentGender=:studentGender, studentPhone=:studentPhone, studentEmail=:studentEmail, studentAddress=:studentAddress, studentUniqueness=:studentUniqueness, studentModified=null  where studentID= :studentID';
  },{quarterID, studentName, studentBirthday, studentGender, studentPhone, studentEmail, studentAddress, studentUniqueness, studentID})
  .then(r => ({complete: true, message: '학생 수정에 성공했습니다.' }))
  .catch(e => ({ complete: false, message: '학생 수정에 실패했습니다.' }));
  res.json(grace);
  },
  async fetch(req, res) {
    const {sid: studentID};
    let promise;
    if(studentID) promise = pool.query('select * from student where studentID=:studentID');
    else promise = pool.query('select * from student');
    return await promise;
  }
};
const quarter = {
  async create(req, res) {
/* @codingjoa
   반을 생성하는 함수: post
   tid: 담당하게 될 선생 id
*/
    const { tid: teacherID } = req.body;
    console.log(req.body);
    const grace = await pool.query({
      namedPlaceholders: true,
      sql: 'insert into quarter(teacherID) values (:teacherID)'
    },{ teacherID })
    .then(r => ({complete: true, message: '반 생성에 성공했습니다.' }))
    .catch(e => ({ complete: false, message: '반 생성에 실패했습니다.' }));
    res.json(grace);
  },
  async rename(req, res) {
    const { qid: quarterID, qname: quarterName } = req.body;
    const grace = await pool.query({
      namedPlaceholders: true,
      sql: 'update quarter set quarterName=:quarterName where quarterID=:quarterID'
    },{ quarterID, quarterName })
    .then(r => ({ complete: true, message: '반 이름 변경에 성공했습니다.' }))
    .catch(e => ({ complete: false, message: '반 이름 변경에 실패했습니다.' }));
    res.json(grace);
  },
  async fetch(req, res) {
    const grace = await pool.query('select * from quarter')
    .then(r => ({ complete: true, data: r }))
    .catch(e => ({ complete: false, message: '조회에 실패했습니다.' }));
    res.json(grace);
  }
}
