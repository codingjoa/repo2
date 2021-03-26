import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Handlar from './Handlar';
function tryCreate(callback, {
  id, teacherName, teacherOp,
  isForeigner, teacherJoined
}) {
  axios.post('/api/admin/teacher', {
    id, teacherName, teacherOp,
    isForeigner, teacherJoined
  })
  .then(r => callback(null, {
    teacherName, tempPassword: r.data.createdData.password
  }))
  .catch(callback);
}

export default () => {
  const history = useHistory();
  const callback = (err, result) => {
    if(err) {
      alert(`생성 실패: ${err.response?.data?.cause ?? err}`);
      return;
    }
    history.push({
      pathname: '/admin/teacher/add',
      state: result
    });
  };
  const [ disabled, setDisabled ] = React.useState(true);
  const validate = (changed, setHelperText) => {
    setDisabled(true);
    if(!changed.id) {
      setHelperText('id', '아이디를 입력해야 합니다');
    }
    else {
      setHelperText('id', null);
    }
    if(!changed.teacherName) {
      setHelperText('teacherName', '이름을 입력해야 합니다.');
    }
    else {
      setHelperText('teacherName', null);
    }
    if(changed.id && changed.teacherName) {
      setDisabled(false);
    }
  };
  const {
    getValues,
    useHandlar,
    useHandlarCheckbox
  } = Handlar(validate);
  const handleSubmit = ({
    id, teacherName, teacherOp, isForeigner, teacherJoined
  }) => {
    tryCreate(callback, {
      id, teacherName, teacherOp, isForeigner, teacherJoined
    });
  };
  return (
  <><Typography variant="subtitle1">새로운 선생님 추가</Typography>
    <Grid item xs={12}>
      <Box m={2}>
      <TextField
        fullWidth
        required
        variant="outlined"
        size="small"
        autoComplete="username"
        type="email"
        label="아이디"
        {...useHandlar('id')}
      />
      </Box>
      <Box m={2}>
      <TextField
        fullWidth
        required
        variant="outlined"
        size="small"
        autoComplete="name"
        type="text"
        label="이름"
        type="text"
        {...useHandlar('teacherName')}
      />
      </Box>
      <Box m={2}>
      <TextField
        fullWidth
        required
        variant="outlined"
        size="small"
        autoComplete="name"
        label="입사일 선택"
        type="date"
        {...useHandlar('teacherJoined')}
      />
      </Box>
      <Box m={2}>
      <Checkbox
        {...useHandlarCheckbox('teacherOp')}
      />
      <Typography
        variant="caption"
      >
        관리자로 생성
      </Typography>
      </Box>
      <Box m={2}>
      <Checkbox
        {...useHandlarCheckbox('isForeigner')}
      />
      <Typography
        variant="caption"
      >
        외국인
      </Typography>
      </Box>
      <Box m={2}>
      <Button
        disabled={disabled}
        variant="contained"
        color="primary"
        onClick={e => getValues(handleSubmit)}
      >
        생성
      </Button>
      </Box>
    </Grid>
  </>
  );
}
