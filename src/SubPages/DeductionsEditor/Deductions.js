import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const columns = [{
  field: 'teacherID',
  headerName: 'ID',
  width: 70
}];
const rows = [{
  id: 1210
}];

export default ({
  fields
}) => (
  <Grid
    item
    xs={12}
  >

    <Box
      display="flex"
    >
      <Box
        m={1}
      >
        <TextField
          variant="outlined"
          size="small"
          autoComplete="no"
          type="number"
          label="레이블"
          name="label"
        />
      </Box>
      <Box
        m={1}
      >
        <TextField
          variant="outlined"
          size="small"
          autoComplete="no"
          type="number"
          label="레이블"
          name="label"
        />
      </Box>
      <Box
        m={1}
      >
        <TextField
          variant="outlined"
          size="small"
          autoComplete="no"
          type="number"
          label="레이블"
          name="label"
        />
      </Box>
      <Box
        m={1}
      >
        <TextField
          variant="outlined"
          size="small"
          autoComplete="no"
          type="number"
          label="레이블"
          name="label"
        />
      </Box>
    </Box>
  </Grid>
);
