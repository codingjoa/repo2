import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
import { Context } from './Context';
function toYearMonth(ym) {
  return ym.replace(/(\d{4})-(\d{1,2})-1$/, '$1년 $2월');
}

export default ({ available }) => {
  const { handleMonth } = React.useContext(Context);
  const makeCheckBox = index => (
    <>
    {available && available[index] &&
    <Box display="flex">
      <Box flexGrow={1} alignSelf="center">
        {toYearMonth(available[index].lessonMonth)} {
          available[index].alreadyLesson ? '(수업중)' :
          available[index].alreadyBilling ? '(접수됨)' :
          null
        }
      </Box>
      <Box>
        <Checkbox onChange={e => handleMonth(available[index].lessonMonth, e.target.checked)} disabled={available[index].alreadyLesson || available[index].alreadyBilling} />
      </Box>
    </Box>
    }
    </>
  );
  return (
    <>
      <Typography variant="subtitle1">
        등록 기간
      </Typography>
      <Page>
        {makeCheckBox(0)}
        {makeCheckBox(1)}
        {makeCheckBox(2)}
      </Page>
    </>
  );
}
