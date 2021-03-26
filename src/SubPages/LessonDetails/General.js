import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Page from '../../Templates/Page';
function makeDate(lessonMonth, lessonCreatedAt) {
  const lm = new Date(lessonMonth);
  const lca = new Date(lessonCreatedAt);
  return {
    getLessonMonth: `${lm.getFullYear()}년 ${lm.getMonth()+1}월`,
    getLessonCreatedAt: lca ? `${lca.getFullYear()}년 ${lca.getMonth()+1}월 ${lca.getDate()}일 ${lca.getHours()}시 ${lca.getMinutes()}분 ${lca.getSeconds()}초` : '정보 없음.'
  };
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default ({
  quarterName, lessonMonth,
  lessonCreatedAt, totalPrice,
  singleStudents, groupStudents
}) => {
  const { getLessonMonth, getLessonCreatedAt } = makeDate(lessonMonth, lessonCreatedAt);
  return (
    <>
      <>
        <Typography variant="subtitle1">
          개요
        </Typography>
        <Page>
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography variant="subtitle2">
                {getLessonMonth}
              </Typography>
              <Typography variant="h6" color="primary">
                {quarterName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption">
                {getLessonCreatedAt}
              </Typography>
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
    </>
  );
}
