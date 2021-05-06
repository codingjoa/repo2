import React from 'react';
import * as ReactRouter from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import Handlar from './Handlar';

import Button from '@material-ui/core/Button';

export default ({
  studentID,
  studentUniqueness,
  op
}) => {
  const history = ReactRouter.useHistory();
  const [ disabled, setDisabled ] = React.useState(true);
  const validate = changed => {
    setDisabled(
      studentUniqueness === changed.studentUniqueness
    );
  };
  const {
    putCloser,
    useHandlar
  } = Handlar({
    studentUniqueness
  }, validate);
  const callback = err => {
    if(err) {
      alert(err);
      return;
    }
    alert('변경되었습니다.');
    history.goBack();
  };
  const handleClick = e => {
    if(op) {
      putCloser(`/api/admin/student/${studentID}`, callback, true)();
    } else {
      putCloser(`/api/teacher/student/${studentID}`, callback, true)();
    }
  };
  return (
    <Grid item xs={12}>
      <Box m={2}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        multiline
        rows="7"
        rowsMax="30"
        autoComplete="no"
        type="text"
        label="특이사항"
        name="uniqueness"
        {...useHandlar('studentUniqueness')}
      />
      </Box>
      <Box m={2}>
      <Button
        disabled={disabled}
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        변경
      </Button>
      </Box>
    </Grid>
  );
}
