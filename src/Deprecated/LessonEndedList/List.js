import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
import Detail from './Detail';
function numberWithCommas(x) {
  if(typeof x !== 'number') {
    return null;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
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
  {list && list?.length>0 && !isCanBeClosed && <Typography variant="subtitle1">마감된 출석부</Typography>}

  {list && list.map(({
    quarterID, quarterName,
    lessonMonth, teacherName,
    singleStudents, groupStudents,
    totalPrice, totalRefundPrice,
    studySize
  }) => <Page>
    <Box display="flex" flexDirection="row-reverse">
      <Box display="flex" flexDirection="column">
        <Box>
          <Detail quarterID={quarterID} lessonMonth={toDateFormat(lessonMonth)} disabled={false}/>
        </Box>
      </Box>
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        <Typography variant="subtitle1">
          {quarterName}({toDateFormatString(lessonMonth)}) / 월 {studySize}회 수업
        </Typography>
        <Typography variant="subtitle2">
          {teacherName ?? '???'} 선생님
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
          수업료
        </Typography>
        <Typography variant="h6" color="primary">
          {numberWithCommas(totalPrice-totalRefundPrice)}/{numberWithCommas(totalPrice)}원
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
  </Page>)}
</>);
