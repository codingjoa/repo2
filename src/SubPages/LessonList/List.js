import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
function toDateFormatString(origin) {
  const time = new Date(origin);
  return `${time.getFullYear()}년 ${time.getMonth()+1}월`;
}
function toDateFormat(origin) {
  const time = new Date(origin);
  return `${time.getFullYear()}-${time.getMonth()+1}-01`;
}

export default ({ list }) => (<>
  {list && list.map(({ quarterName, quarterID, lessonMonth}) => <Page key={`${quarterID}-${lessonMonth}`}>
    <Box display="flex">
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        <Typography variant="h6">
          {quarterName}
        </Typography>
        <Typography variant="subtitle1">
          {toDateFormatString(lessonMonth)}
        </Typography>
      </Box>
      <Box>
        <Button
          color="primary"
          component={Link}
          to={`/lesson/detail/${quarterID}/${toDateFormat(lessonMonth)}`}
          variant="contained"
        >
          상세보기
        </Button>
      </Box>
    </Box>
  </Page>)}
</>);
