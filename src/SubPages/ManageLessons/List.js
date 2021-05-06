import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
import ChangeTeacher from './ChangeTeacher';
import Close from './Close';
import Delete from './Delete';
import Detail from './Detail';
import QuarterStudentAdd from './QuarterStudentAdd';
import Register from './Register';
import { orange, purple, indigo, grey } from '@material-ui/core/colors';
import { createMuiTheme, createStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
const unpaidTheme = createMuiTheme({
  palette: {
    secondary: {
      main: orange[500]
    }
  }
});
const refundTheme = createMuiTheme({
  palette: {
    secondary: {
      main: purple[500]
    }
  }
});
/*
const useStyles = makeStyles({
  refund: {
    color: purple[500],
    borderColor: purple[500]
  },
  unpaid: {
    color: orange[500],
    borderColor: orange[500]
  },
  normal: {
    color: indigo[500],
    borderColor: indigo[500]
  },
  default: {
    color: grey[500],
    borderColor: grey[500]
  }
});
*/
/*
const useStyles = makeStyles(theme => createStyles({
  refund: {
    colorSecondary: theme.color.purple
  },
  unpaid: {
    colorSecondary: theme.color.orange
  }
}));
*/
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
  axios.delete(`/api/admin/student/${studentID}/quarter`)
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
  isCanBePosted, lastStudySize, reload, lessonEnded
}) {
  return (
    <Box
      display="flex"
    >
      <Grid container>
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
            lastStudySize={lastStudySize}
            quarterID={quarterID}
            quarterName={quarterName}
            teacherName={teacherName}
            disabled={!isCanBePosted}
          />
        </Box>
        <Box m={1}>
          <Close
            quarterID={quarterID}
            lessonMonth={toDateFormat(lessonMonth)}
            disabled={isCanBeClosed===0}
            quarterName={quarterName}
            reload={reload}
          />
        </Box>
        <Box m={1}>
          <Delete
            quarterID={quarterID}
            lessonMonth={toDateFormat(lessonMonth)}
            disabled={lessonRegCode===0 || lessonEnded===1}
            quarterName={quarterName}
            reload={reload}
          />
        </Box>
      </Grid>
    </Box>
  );
}
function StudentList({
  groupStudent,
  lessonMonth,
  quarterID,
  lessonEnded,
  lessonRegCode,
  reload,
  students,
  singleStudent,
  totalStudent,
  totalBillingRegStudent
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
        <Grid container>
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
              student[1][3]===0 && lessonRegCode===0 && history.push(`/admin/billing/${student[0]}`);
              student[1][3]===0 && lessonRegCode===1 && history.push(`/admin/billing/${student[0]}/${lessonMonth}/${quarterID}/middle`);
              student[1][3]===1 && history.push(`/admin/billing/${student[0]}/${lessonMonth}`);
            }
            return (
              <Box
                key={student[0]}
                m={1}
              >
                <StudentChipColor
                  colorCode={student[1][1]}
                >
                  <StudentChip
                    billingRegCode={student[1][3]}
                    lessonRegCode={lessonRegCode}
                    colorCode={student[1][1]}
                    handleClick={handleClick}
                    handleDelete={handleDelete}
                    studentName={student[1][0]}
                  />
                </StudentChipColor>
              </Box>
            );
          })}
          <Box
            m={1}
          >
            <QuarterStudentAdd
              lessonEnded={lessonEnded}
              quarterID={quarterID}
            />
          </Box>
        </Grid>
      </Box>
      <Box>
        <Typography
          variant="caption"
        >
          개인 {singleStudent}명 / 그룹 {groupStudent}명 / 미등록 {totalStudent - totalBillingRegStudent} 명
        </Typography>
      </Box>
    </>
  );
}
function StudentChipColor({
  colorCode,
  children
}) {
  return (
    <ThemeProvider
      theme={refundTheme}
    >
      {colorCode!==1 && children}
      <ThemeProvider
        theme={unpaidTheme}
      >
        {colorCode===1 && children}
      </ThemeProvider>
    </ThemeProvider>
  );
}

function StudentChip({
  billingRegCode,
  lessonRegCode,
  colorCode,
  handleClick,
  handleDelete,
  studentName
}) {
  if(lessonRegCode === 1 && billingRegCode === 1) {
    return (
      <Chip
        clickable
        color={(billingRegCode === 1 ? (colorCode>0 ? 'secondary' : 'primary') : 'default')}
        label={studentName}
        onClick={handleClick}
        size="small"
        variant="outlined"
      />
    );
  }
  return (
    <Chip
      clickable
      color={(billingRegCode === 1 ? (colorCode>0 ? 'secondary' : 'primary') : 'default')}
      label={studentName}
      onClick={handleClick}
      onDelete={handleDelete}
      size="small"
      variant="outlined"
    />
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
    quarterID, quarterName, lastStudySize, lessonMonth,
    teacherID, teacherName, lessonRegCode,
    lessonEnded, isCanBeClosed, students,
    isCanBePosted, totalSingleStudent, totalGroupStudent,
    totalPrice, totalRefundPrice, studySize, studyOkSize,
    totalStudent, totalBillingRegStudent
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
      lastStudySize={lastStudySize}
      lessonMonth={lessonMonth}
      quarterID={quarterID}
      quarterName={quarterName}
      lessonRegCode={lessonRegCode}
      studentsLen={students?.length ?? 0}
      students={students}
      teacherID={teacherID}
      teacherName={teacherName}
      isCanBePosted={isCanBePosted}
      reload={reload}
      lessonEnded={lessonEnded}
    />
    <StudentList
      groupStudent={totalGroupStudent}
      lessonMonth={lessonMonth}
      quarterID={quarterID}
      lessonEnded={lessonEnded}
      lessonRegCode={lessonRegCode}
      reload={reload}
      students={students}
      singleStudent={totalSingleStudent}
      totalStudent={totalStudent}
      totalBillingRegStudent={totalBillingRegStudent}
    />
    <Price
      totalPrice={totalPrice}
      totalRefundPrice={totalRefundPrice}
    />
  </Page>)}
</>);
