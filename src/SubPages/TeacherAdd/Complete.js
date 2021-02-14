import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

export default () => {
  const location = useLocation();
  return (
  <Grid item xs={12}>
    <Box display="flex" justifyContent="center">
      <Typography>
        {location.state.teacherName} 선생님의 계정이 생성되었습니다. 
        임시 비밀번호는 {location.state.tempPassword}입니다.
      </Typography>
    </Box>
    <Box display="flex" justifyContent="center">
      <Button variant="contained" color="primary" component={Link} to="/admin/teacher">
        완료
      </Button>
    </Box>
  </Grid>
  );
}
