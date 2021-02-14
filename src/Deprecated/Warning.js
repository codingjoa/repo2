import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import WarningIcon from '@material-ui/icons/Warning';

export default ({ message }) => (
  <Grid item xs={12}>
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Box>
        <WarningIcon />
      </Box>
      <Box>
        {message}
      </Box>
    </Box>
  </Grid>
)
