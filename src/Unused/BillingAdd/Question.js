import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Page from '../../Templates/Page';
import { Context } from './Context';

export default () => {
  const { getResult, handleBack, handleSubmit } = React.useContext(Context);
  const result = getResult();
  return (
    <>
      <Typography variant="subtitle1">
        최종 확인
      </Typography>
      <Page>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography variant="subtitle2">
              학생 이름
            </Typography>
            <Typography variant="h6">
              {result.params.studentID}
            </Typography>
          </Box>
        </Box>
        <Box display="flex">
          <Box><Button variant="contained" color="secondary" onClick={handleSubmit}>확인</Button></Box>
          <Box><Button variant="contained" color="primary" onClick={handleBack}>뒤로</Button></Box>
        </Box>
      </Page>
    </>
  );
}
