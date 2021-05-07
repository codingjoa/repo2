import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormHandlar from '../../Templates/FormHandlar';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
function addQuarterStudents(quarterID, values, callback) {
  axios.post(`/api/teacher/student/${quarterID}`, values)
  .then(result => callback(null, result), callback);
}
function Forms() {
  const { quarterID } = ReactRouter.useParams();
  const history = ReactRouter.useHistory();
  const [ disabled, setDisabled ] = React.useState(true);
  const validate = changed => {
    const empty = (
      changed.studentName === '' ||
      changed.studentPhone === ''
    );
    if(empty) {
      setDisabled(true);
      return;
    }
    setDisabled(
      '' === changed.studentName &&
      '' === changed.studentPhone
    );
  };
  const handlar = FormHandlar(validate, {
    studentName: '',
    studentPhone: ''
  });
  const handleClick = () => {
    handlar.getValues(values => {
      addQuarterStudents(quarterID, values, err => {
        if(err) {
          alert(err);
          return;
        }
        history.goBack();
      });
    });
  };
  return (
    <Grid item xs={12}>
      <Box m={2}>
      <TextField
        fullWidth
        required
        variant="outlined"
        size="small"
        autoComplete="no"
        type="text"
        label="이름"
        name="name"
        {...handlar.useHandlar('studentName')}
      />
      </Box>
      <Box m={2}>
      <TextField
        fullWidth
        required
        variant="outlined"
        size="small"
        autoComplete="no"
        type="text"
        label="전화번호"
        name="phone"
        {...handlar.useHandlar('studentPhone')}
      />
      </Box>
      <Box m={2}>
      <Button
        disabled={disabled}
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        추가
      </Button>
      </Box>
    </Grid>
  );
}



export default function({
  op
}) {
  //학생 추가
  if(op) {
    return null;
  }
  return (
    <>
      <Typography
        variant="subtitle1"
      >
        새 학생 추가하기
      </Typography>
      <Forms />
    </>
  );
};
