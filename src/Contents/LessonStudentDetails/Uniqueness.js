import React from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import Handlar from './Handlar';

import Button from '@material-ui/core/Button';

export default ({
  studentID,
  studentUniqueness
}) => {
  const { quarterID, lessonMonth } = useParams();
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
        onClick={e => putCloser(`/api/teacher/lesson/${quarterID}/${lessonMonth}/student/${studentID}`, callback, true)()}
      >
        변경
      </Button>
      </Box>
    </Grid>
  );
}
