import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
import Detail from './Detail';
import Close from './Close';

function toDateFormatString(origin) {
  const time = new Date(origin);
  return `${time.getFullYear()}년 ${time.getMonth()+1}월`;
}
function toDateFormat(origin) {
  const time = new Date(origin);
  return `${time.getFullYear()}-${time.getMonth()+1}-01`;
}

export default ({ list, isCanBeClosed }) => (<>
  {list && list?.length>0 && isCanBeClosed && <Typography variant="subtitle1">마감해야 하는 출석부</Typography>}
  {list && list?.length>0 && !isCanBeClosed && <Typography variant="subtitle1">진행중인 출석부</Typography>}

  {list && list.map(({ quarterID, quarterName, lessonMonth, teacherName }) => <Page>
    <Box display="flex" flexDirection="row-reverse">
      <Box display="flex" flexDirection="column">
        <Box mb={1}>
          <Detail quarterID={quarterID} lessonMonth={toDateFormat(lessonMonth)} disabled={false}/>
        </Box>
        <Box>
          <Close quarterID={quarterID} lessonMonth={toDateFormat(lessonMonth)} disabled={false && !isCanBeClosed} quarterName={quarterName}/>
        </Box>
      </Box>
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        <Typography variant="subtitle1">
          {quarterName}({toDateFormatString(lessonMonth)})
        </Typography>
        <Typography variant="subtitle2">
          {teacherName ?? '???'} 선생님
        </Typography>
      </Box>
    </Box>
  </Page>)}
</>);
