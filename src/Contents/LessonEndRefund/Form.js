import React from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Page from '../../Templates/Page';
import Handlar from './Handlar';
export default ({ list, callback }) => {
  const { goNext, useHandlar } = Handlar(list);
  const history = useHistory();
  return (
  <>
    <Typography variant="subtitle1">
      환불 사유 기록
    </Typography>
    <Page>
      {list && list.map(({ studentID, studentName }) =>
        <Box display="flex" alignItem="center">
          <Box m={1} flexGrow={0} alignSelf="center">
            {studentName}
          </Box>
          <Box flexShrink={1}>
            <TextField
              label="환불 금액(%)"
              variant="outlined"
              size="small"
              select
              {...useHandlar(studentID, 'refundPercent', 100)}
            >
              <MenuItem value={100}>100%</MenuItem>
              <MenuItem value={50}>50%</MenuItem>
            </TextField>
          </Box>
          <Box flexShrink={1}>
            <OutlinedInput
              placeholder="환불/이월 사유"
              margin="dense"
              {...useHandlar(studentID, 'refundReason')}
            />
          </Box>
        </Box>
      )}
    </Page>
    <Grid item xs={12}>
      <Box display="flex" flexDirection="row-reverse">
        <Box>
          <Button variant="contained" color="secondary" onClick={e => history.goBack()}>이전</Button>
        </Box>
        <Box>
          <Button variant="contained" color="primary" onClick={e => goNext(callback)}>다음</Button>
        </Box>
      </Box>
    </Grid>
  </>
  );
}
