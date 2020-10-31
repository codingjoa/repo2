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

export default ({ quarterName, lessonMonth, lessonCreatedAt }) => {
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
        </Page>
      </>
    </>
  );
}
