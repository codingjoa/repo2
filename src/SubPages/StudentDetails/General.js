import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import Handlar from './Handlar';

import Button from '@material-ui/core/Button';

function dateOnly(origin) {
  const localeString = new Date(Date.parse(origin)).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  return /^(\d+). (\d+). (\d+)/.test(localeString) ?
    `${RegExp.$1}-${RegExp.$2.length<2 ? `0${RegExp.$2}` : RegExp.$2}-${RegExp.$3.length<2 ? `0${RegExp.$3}` : RegExp.$3}`
  : '';
}

export default ({
  /*
  studentID,
  studentName,
  studentBirthday,
  studentGender,
  studentPhone,
  studentEmail,
  studentAddress
  */
  studentID,
  studentName,
  studentPhone
}) => {
  const [ disabled, setDisabled ] = React.useState(true);
  const validate = changed => {
    const empty = (
      changed.studentName === '' ||
      changed.studentPhone === ''
      /*
      changed.studentName === '' ||
      changed.studentBirthday === '' ||
      changed.studentGender === '' ||
      changed.studentPhone === '' ||
      changed.studentEmail === '' ||
      changed.studentAddress === ''
      */
    );
    if(empty) {
      setDisabled(true);
      return;
    }
    setDisabled(
      studentName === changed.studentName &&
      studentPhone === changed.studentPhone
      /*
      studentName === changed.studentName &&
      dateOnly(studentBirthday) === changed.studentBirthday &&
      studentGender === changed.studentGender-0 &&
      studentPhone === changed.studentPhone &&
      studentEmail === changed.studentEmail &&
      studentAddress === changed.studentAddress
      */
    );
  };
  const {
    putCloser,
    useHandlar
  } = Handlar({
    studentName,
    studentPhone
    /*
    studentName,
    studentBirthday: dateOnly(studentBirthday),
    studentGender,
    studentPhone,
    studentEmail,
    studentAddress
    */
  }, validate);
  const callback = err => {
    if(err) {
      alert(err);
      return;
    }
    alert('변경되었습니다.');
  };
  return (
  <><Typography variant="subtitle1">학생 정보 조회/수정</Typography>
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
        {...useHandlar('studentName')}
      />
      </Box>
      {/*
      <Box m={2}>
      <TextField
        fullWidth
        required
        variant="outlined"
        size="small"
        autoComplete="no"
        type="text"
        label="생년월일"
        type="date"
        name="birthday"
        {...useHandlar('studentBirthday')}
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
        label="성별"
        type="date"
        name="gender"
        select
        {...useHandlar('studentGender')}
      >
        <MenuItem value={0}>여</MenuItem>
        <MenuItem value={1}>남</MenuItem>
      </TextField>
      </Box>
      */}
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
        {...useHandlar('studentPhone')}
      />
      </Box>
      {/*
      <Box m={2}>
      <TextField
        fullWidth
        required
        variant="outlined"
        size="small"
        autoComplete="no"
        type="email"
        label="이메일"
        name="email"
        {...useHandlar('studentEmail')}
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
        label="주소"
        name="address"
        {...useHandlar('studentAddress')}
      />
      </Box>
      */}
      <Box m={2}>
      <Button
        disabled={disabled}
        variant="contained"
        color="primary"
        onClick={e => putCloser(`/api/admin/student/${studentID}`, callback)()}
      >
        변경
      </Button>
      </Box>
    </Grid>
  </>);
}
