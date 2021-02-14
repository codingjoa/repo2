import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

export default () => (
  <Grid item xs={12}>
    <Box display="flex" justifyContent="center">
      <Typography>
        비밀번호가 변경되었습니다.
      </Typography>
    </Box>
    <Box display="flex" justifyContent="center">
      <Button variant="contained" color="primary" component={Link} to="/">
        완료
      </Button>
    </Box>
  </Grid>
)
