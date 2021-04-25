import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
import ChangeTeacher from './ChangeTeacher';
import Close from './Close';
import Detail from './Detail';
import QuarterStudentAdd from './QuarterStudentAdd';
import Register from './Register';
function numberWithCommas(x) {
  if(typeof x !== 'number') {
    return '';
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function deleteBilling(studentID, lessonMonth, callback) {
  axios.delete(`/api/admin/billing/${studentID}/${lessonMonth}`)
  .then(result => callback(null, result), callback);
}
function deleteQuarterStudents(studentID, callback) {
  axios.delete(`/api/dev/teacher/student/${studentID}`)
  .then(result => callback(null, result), callback);
}
function MainLayer({
  lessonRegCode,
  quarterName,
  teacherID,
  teacherName
}) {
  return (
    <Box display="flex">
      <Box
        alignSelf="center"
        display="flex"
        flexGrow={1}
      >
        <Box
          flexGrow={1}
        >
          <Typography
            variant="subtitle2"
          >
            팀명
          </Typography>
          <Typography
            color="primary"
            variant="h6"
          >
            {quarterName}
          </Typography>
        </Box>
        <Box
          textAlign="right"
        >
          <Typography
            variant="subtitle2"
          >
            지도강사
          </Typography>
          <Typography
            color="primary"
            variant="h6"
          >
            {(teacherName) ?? '없음'}{teacherID && lessonRegCode===0 && '(예정)'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
function StudyStatusLayer({
  lessonRegCode,
  lessonEnded,
  studySize,
  studyOkSize,
  isCanBePosted
}) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
      >
        팀 현황
      </Typography>
      <Typography
        color="primary"
        variant="h6"
      >
        {lessonEnded===1 && '마감완료.'}
        {lessonRegCode===1 && lessonEnded===0 && (studyOkSize===studySize ? `${studySize}회 수업완료.` : `${studyOkSize+1}/${studySize} 회차 수업중.`)}
        {isCanBePosted===1 && lessonRegCode===0 && '발행 대기중.'}
        {isCanBePosted===0 && lessonRegCode===0 && '발행 불가.'}
      </Typography>
    </Box>
  );
}
function ButtonLayer({
  quarterID, quarterName, lessonMonth,
  lessonRegCode, isCanBeClosed, teacherID,
  teacherName, studentsLen, students,
  isCanBePosted
}) {
  return (
    <Box
      display="flex"
    >
      <Box m={1}>
        <Detail
          quarterID={quarterID}
          lessonMonth={toDateFormat(lessonMonth)}
          disabled={lessonRegCode===0}
        />
      </Box>
      <Box m={1}>
        <ChangeTeacher
          quarterID={quarterID}
          quarterName={quarterName}
          teacherID={teacherID}
          disabled={lessonRegCode===1}
        />
      </Box>
      <Box m={1}>
        <Register
          quarterID={quarterID}
          quarterName={quarterName}
          teacherName={teacherName}
          disabled={!isCanBePosted/*teacherID===null || lessonRegCode===1 || (studentsLen===0 && DO.getFullYear== *//*그리고 이번달 이어야함*/}
        />
      </Box>
      <Box m={1}>
        <Close
          quarterID={quarterID}
          lessonMonth={toDateFormat(lessonMonth)}
          disabled={isCanBeClosed===0}
          quarterName={quarterName}
        />
      </Box>
    </Box>
  );
}
function StudentList({
  groupStudent,
  lessonMonth,
  quarterID,
  lessonRegCode,
  reload,
  students,
  singleStudent
}) {
  const history = ReactRouter.useHistory();
  return (
    <>
      <Typography
        variant="subtitle2"
      >
        학생 목록
      </Typography>
      <Box
        display="flex"
      >
        {students && students.map((student) => {
          /* student[studentID, [studentName(String), billingGroup(0|1), billingPrice(Number), lessonRegCode(0|1)]]*/
          const handleDelete = () => {
            if(student[1][3] === 1) {
              const userAnswer = window.confirm(`${student[1][0]} 학생의 입금을 철회합니다.`);
              if(!userAnswer) {
                return;
              }
              deleteBilling(student[0], lessonMonth, (err, result) => {
                if(err) {
                  alert(err);
                  return;
                }
                reload();
              });
            } else {
              const userAnswer = window.confirm(`${student[1][0]} 학생을 팀에서 해제시킵니다.`);
              if(!userAnswer) {
                return;
              }
              deleteQuarterStudents(student[0], (err, result) => {
                if(err) {
                  alert(err?.response.data?.cause ?? err);
                  return;
                }
                reload();
              });
            }
          };
          const handleClick = () => {
            student[1][3]===0 && history.push(`/test/billing/${student[0]}`);
            student[1][3]===1 && history.push(`/test/billing/${student[0]}/${lessonMonth}`);
          }
          return (
            <Box
              key={student[0]}
              m={1}
            >

              {lessonRegCode === 1 ?
                <Chip
                  clickable
                  color={student[1][1]===1 ? 'secondary' : (student[1][3]===1 ? 'primary' : 'default')}
                  label={student[1][0]}
                  onClick={handleClick}
                  size="small"
                  variant="outlined"
                /> :
                <Chip
                  clickable
                  color={student[1][1]===1 ? 'secondary' : (student[1][3]===1 ? 'primary' : 'default')}
                  label={student[1][0]}
                  onClick={handleClick}
                  onDelete={handleDelete}
                  size="small"
                  variant="outlined"
                />
              }
            </Box>
          );
        })}
        <Box
          m={1}
        >
          <QuarterStudentAdd
            disabled={lessonRegCode === 1}
            quarterID={quarterID}
          />
          {/**notice: 여기 학생 중도 추가하는 기능 넣어야 합니다.,
          *notice: 학생 목록이 오버플로되어 보이는 현상 막아야 합니다.*/}
        </Box>
      </Box>
      <Box>
        <Typography
          variant="caption"
        >
          개인 {singleStudent}명 / 그룹 {groupStudent}명
        </Typography>
      </Box>
    </>
  );
}
function Price({
  totalPrice,
  totalRefundPrice
}) {
  return (
    <Box>
      <Typography
        color="primary"
        variant="h6"
      >
        총 수업료 {numberWithCommas(totalPrice)} 원
      </Typography>
      {totalRefundPrice !== 0 &&
        <Typography
          color="secondary"
          variant="caption"
        >
          {numberWithCommas(totalRefundPrice)}원 환불됨.
        </Typography>
      }
    </Box>
  );
}
function toDateFormat(origin) {
  const time = new Date(origin);
  return `${time.getFullYear()}-${time.getMonth()+1}-01`;
}

export default ({
  list,
  reload
}) => (<>
  {list && list.map(({
    quarterID, quarterName, lessonMonth,
    teacherID, teacherName, lessonRegCode,
    lessonEnded, isCanBeClosed, students,
    isCanBePosted, singleStudent, groupStudent,
    totalPrice, totalRefundPrice, studySize, studyOkSize
  }) => <Page key={quarterID}>
    <MainLayer
      lessonRegCode={lessonRegCode}
      quarterName={quarterName}
      teacherID={teacherID}
      teacherName={teacherName}
    />
    <StudyStatusLayer
      lessonRegCode={lessonRegCode}
      lessonEnded={lessonEnded}
      studySize={studySize}
      studyOkSize={studyOkSize}
      isCanBePosted={isCanBePosted}
    />
    <ButtonLayer
      isCanBeClosed={isCanBeClosed}
      lessonMonth={lessonMonth}
      quarterID={quarterID}
      quarterName={quarterName}
      lessonRegCode={lessonRegCode}
      studentsLen={students?.length ?? 0}
      students={students}
      teacherID={teacherID}
      teacherName={teacherName}
      isCanBePosted={isCanBePosted}
    />
    <StudentList
      groupStudent={groupStudent}
      lessonMonth={lessonMonth}
      quarterID={quarterID}
      lessonRegCode={lessonRegCode}
      reload={reload}
      students={students}
      singleStudent={singleStudent}
    />
    <Price
      totalPrice={totalPrice}
      totalRefundPrice={totalRefundPrice}
    />
  </Page>)}
</>);
