import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default ({
  income,
  toCompany,
  toVAT,
  toTeacher,
  deductionsFromCompany,
  deductionsFromTeacher
}) => (
  <Grid
    item
    xs={12}
  >
    회사 예상 수익 = 수업료 합계 - 수업료 부가세 - 차인지급액 - 선생님 부담 공제 - 회사 부담 공제
    <Grid
      container
    >
      <Grid
        item
        xs={3}
        alignItems="flex-end"
      >
        {toCompany}
      </Grid>
      <Grid
        item
        xs={3}
      >
        {income}
      </Grid>
      <Grid
        item
        xs={3}
      >
        {toVAT}
      </Grid>
      <Grid
        item
        xs={3}
      >
        {toTeacher}
      </Grid>
    </Grid>
    <Box
      display="flex"
    >
      <Box
        m={1}
      >
        {toCompany} = {income} - {toVAT} - {toTeacher} - {deductionsFromTeacher} - {deductionsFromCompany}
      </Box>
    </Box>
  </Grid>
);
