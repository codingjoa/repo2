import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Page from '../../Templates/Page';
function makeDate(lessonMonth, lessonCreatedAt, lessonEndedAt) {
  const lm = new Date(lessonMonth);
  const lca = new Date(lessonCreatedAt);
  const lea = lessonEndedAt ? new Date(lessonEndedAt) : null;
  return {
    getLessonMonth: `${lm.getFullYear()}년 ${lm.getMonth()+1}월`,
    getLessonCreatedAt: lca ? `${lca.getFullYear()}년 ${lca.getMonth()+1}월 ${lca.getDate()}일 ${lca.getHours()}시 ${lca.getMinutes()}분 ${lca.getSeconds()}초` : '정보 없음.',
    getLessonEndedAt: lea ? `${lea.getFullYear()}년 ${lea.getMonth()+1}월 ${lea.getDate()}일 ${lea.getHours()}시 ${lea.getMinutes()}분 ${lea.getSeconds()}초` : '정보 없음.'
  };
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default ({
  quarterName, lessonMonth, teacherName,
  lessonCreatedAt, lessonEndedAt, totalPrice,
  singleStudents, groupStudents
}) => {
  const {
    getLessonMonth,
    getLessonCreatedAt,
    getLessonEndedAt
  } = makeDate(
    lessonMonth,
    lessonCreatedAt,
    lessonEndedAt
  );
  return (
    <>
      <Typography variant="subtitle1">
          개요
      </Typography>
      <Page>
        <Box>
          <Box flexGrow={1}>
            <Typography variant="subtitle2">
              {getLessonMonth}/{teacherName}
            </Typography>
            <Typography variant="h6" color="primary">
              {quarterName}
            </Typography>
          </Box>
          <Box>
            <Box>
              <Typography variant="caption">
                출석부 발행: {getLessonCreatedAt}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption">
                출석부 마감: {getLessonEndedAt}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
        >
          <Box
            mr={2}
          >
            <Typography variant="subtitle2">
              총 수업료
            </Typography>
            <Typography variant="h6" color="primary">
              {numberWithCommas(totalPrice)}원
            </Typography>
          </Box>
          <Box
            mr={2}
          >
            <Typography variant="subtitle2">
              개인 학생
            </Typography>
            <Typography variant="h6" color="primary">
              {singleStudents}명
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">
              단체 학생
            </Typography>
            <Typography variant="h6" color="primary">
              {groupStudents}명
            </Typography>
          </Box>
        </Box>
      </Page>
    </>
  );
}
