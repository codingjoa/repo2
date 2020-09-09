
module.exports = function studyChecking(pool) {
  return {

  async check(req, res) {
// 선생은 교사가 바뀔때 대비해서
    try {
      const { sdate: studyDate, qid: quarterID, sid: studentID } = req.body;
/* @codingjoa
   등록하려는 학생이 반에 있는지 검사
*/
const result = await pool.query(
  'select studentID from student where quarterID=? and studentID=?',
  [ quarterID, studentID ]
);
if(!result.length) throw new Error('학생 소속 오류');

/* @codingjoa
   오늘 수업을 이미 만들었는지 확인함
   오늘 날짜와 반의 id를 대입함
*/
      const study = await pool.query(
        'select s.studyID, q.teacherID from study s inner join quarter q on s.quarterID=q.quarterId where s.studyDate=? and q.quarterID=?',
        [ studyDate, quarterID ]
      );
/* @codingjoa
   오늘 수업이 없는데 출석 체크를 시도하고 있음.
   따라서 오늘 수업을 만듬
   이 반의 선생 id를 먼저 가져오고
   수업 개최자 정보에 선생id와 수업을 한 반의 id를 등록함
   생성된 수업의 아이디를 반환값으로 받음
   생성된 수업이 이미 있으면 study.studyID 에서 가져옴
*/
let studyID;
if(!study.length) {
  const result = await pool.query(
    'select t.teacherID from teacher t inner join quarter q on q.teacherID=t.teacherID where quarterID=?',
    [ quarterID ]
  );
  const { insertId } = await pool.query(
    'insert into study(teacherID, quarterID) values(?, ?)',
    [ result[0].teacherID, quarterID ]
  );
  studyID = insertId;
}
else studyID = study[0].studyID;
/* @codingjoa
   req.body에서 받은 등록할 학생id와
   오늘(등록하고자 하는)날의 studyID를 이용해
   checking 등록
*/
// todo: 이미 출석했으면 못하게 막아야...
const grace = await pool.query(
  'insert into checking(studyID, studentID) values (?, ?)',
  [ studyID, studentID ]
)
.then(r => ({ complete: true, message: '출석이 등록되었습니다.' }))
.catch(e => ({ complete: false, message: e.message })); 

      res.json(grace);
    }
    catch(e) {
      res.json({ complete: false, message: e.message });
    }
    
  },
  async addStudy(req, res) {
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
  async fetch(req, res) {
/* @codingjoa
   출석부를 조회함
*/
    const { qid: quarterID, date: studyDate } = req.query ?? {};
    const grace = pool.query(
      'select s.studyID, c.checkingID, s.teacherID, st.studentID, st.studentName, s.studyDate, c.checkModified from study s, checking c, student st where s.studyID=c.studyID and c.studentID=st.studentID and s.studyDate=? and s.quarterID=?',
      [ studyDate, quarterID ]
    )
    .then(r => {
      if(r.length === 0) throw { message: '조회된 데이터 없음' };
      return r;
    });

    await grace.then(r => res.json({ complete: true, message: '조회에 성공했습니다.', data: r }))
    .catch(e => res.json({ complete: false, message: '조회에 실패했습니다.', cause: e.message }));
  }

  }
};

/*
이 반에 출석부가 있는지 조사
select s.studyID, q.teacherID from study s, quarter q where s.quarterID=q.quarterId and s.studyDate="2020-08-30" and q.quarterID=5;



  { date: studyDate }


  { sid: studentID } = req.body ?? {};
  pool.query('update checking (sid, qid, name, isDeleted) select sid, qid, name, isDeleted from student where sid = (?)', [sid]);

  async student(sid){
    let promise;
    if(sid) promise = pool.query('select * from student_check where sid=(?)', [ sid ]);
    else promise = pool.query('select * from student_check where isDeleted=0');
    return await promise;
  }
return await pool.query('select sid, q.qid, name, email, tid, classes from quarter_imformation q left join student s on q.qid = s.qid');
*/

/*
select * from student st, study s, checking c where st.quarterID=s.quarterID and c.studyID=s.studyID and s.studyDate="2020-08-30";

이 반에서 모든 출석(반 id 추가햐야함)
select st.studentID, s.quarterID, s.studyID, s.studyDate, c.checkTime from student st, study s, checking c where st.studentID=c.studentID and s.quarterID=st.quarterID and s.studyID=c.studyID;
이 반에서 오늘 출석(반id 추가햐야함)
select st.studentID, s.quarterID, s.studyID, s.studyDate, c.checkTime from student st, study s, checking c where st.studentID=c.studentID and s.quarterID=st.quarterID and s.studyID=c.studyID and s.studyDate="2020-08-30";
이 반에서 이 학생의 최종 출석일
이 반에서 이 학생의 기간동안의 출석 일수

getFullYear();
(getMonth()) / 3;
=> 0~2/3 = 0
=> 3~5/3 = 1
=> 6~8/3 = 2
=> 9~11/3 = 3



출석처리
update from checking set checkOk=1 where studentID=1 and studyID=6;

이 반의 학생 수
select count(*), t.teacherID, q.quarterID, st.studentID, st.studentName from teacher t, quarter q, student st where t.teacherID=q.teacherID and q.quarterID=st.quarterID and q.quarterID=5; 
이 반의 학생 목록과 최근 출석
select * from ( select t.teacherID, q.quarterID, st.studentID, st.studentName, s.studyDate, max(s.studyDate) from teacher t, quarter q, student st, study s where t.teacherID=q.teacherID and q.quarterID=st.quarterID and s.quarterID=st.quarterID and q.quarterID=5 order by s.studyDate asc) as m group by m.studentID;

*/
