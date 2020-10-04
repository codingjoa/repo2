
/*

  async student(sid){
    let promise;
    if(sid) promise = pool.query('select * from student_check where sid=(?)', [ sid ]);
    else promise = pool.query('select * from student_check where isDeleted=0');
    return await promise;
  }
return await pool.query('select sid, q.qid, name, email, tid, classes from quarter_imformation q left join student s on q.qid = s.qid');
*/

/*
getFullYear();
(getMonth()) / 3;
=> 0~2/3 = 0
=> 3~5/3 = 1
=> 6~8/3 = 2
=> 9~11/3 = 3


select * from student st, study s, checking c where st.quarterID=s.quarterID and c.studyID=s.studyID and s.studyDate="2020-08-30";

이 반에 출석부가 있는지 조사
select s.studyID, q.teacherID from study s, quarter q where s.quarterID=q.quarterID and s.studyDate="2020-08-30" and q.quarterID=5;


이 반에서 모든 출석(반 id 추가햐야함)
select st.studentID, s.quarterID, s.studyID, s.studyDate, c.checkTime from student st, study s, checking c where st.studentID=c.studentID and s.quarterID=st.quarterID and s.studyID=c.studyID;
이 반에서 오늘 출석(반id 추가햐야함)
select st.studentID, s.quarterID, s.studyID, s.studyDate, c.checkTime from student st, study s, checking c where st.studentID=c.studentID and s.quarterID=st.quarterID and s.studyID=c.studyID and s.studyDate="2020-08-30";
이 반에서 이 학생의 최종 출석일
이 반에서 이 학생의 기간동안의 출석 일수

이 반의 학생 수
select count(*), t.teacherID, q.quarterID, st.studentID, st.studentName from teacher t, quarter q, student st where t.teacherID=q.teacherID and q.quarterID=st.quarterID and q.quarterID=5; 
이 반의 학생 목록과 최근 출석
select * from ( select t.teacherID, q.quarterID, st.studentID, st.studentName, s.studyDate, max(s.studyDate) from teacher t, quarter q, student st, study s where t.teacherID=q.teacherID and q.quarterID=st.quarterID and s.quarterID=st.quarterID and q.quarterID=5 order by s.studyDate asc) as m group by m.studentID;

*/
