import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Handlar from './Handlar';
function tryPasswordChange(callback, { password, newpw }) {
  axios.patch('/api/account/edit', { password, newpw })
  .then(r => callback())
  .catch(callback);
}

export default () => {
  const history = useHistory();
  const callback = err => {
    if(err) {
      alert(`변경 실패: ${err.response.data.cause}`);
      return;
    }
    history.push({
      pathname: '/account/password',
      state: { complete: true }
    });
  };
  const [ disabled, setDisabled ] = React.useState(true);
  const validate = (changed, setHelperText) => {
    setDisabled(true);
    if(!changed.password) {
      setHelperText('password', '비밀번호를 입력해야 합니다.');
      return;
    }
    else {
      setHelperText('password', null);
    }
    if(!changed.newpw) {
      setHelperText('newpw', '새 비밀번호를 입력해야 합니다.');
      return
    }
    else {
      setHelperText('newpw', null);
    }
    if(changed.newpw !== changed.newpwCheck) {
      setHelperText('newpwCheck', '확인 비밀번호가 일치하지 않습니다.');
    }
    else {
      setHelperText('newpwCheck', null);
      setDisabled(false);
    }
  };
  const {
    getValues,
    useHandlar
  } = Handlar(validate);
  const handleSubmit = ({ password, newpw }) => {
    tryPasswordChange(callback, { password, newpw });
  };
  return (
  <><Typography variant="subtitle1">비밀번호 변경</Typography>
    <Grid item xs={12}>
      <Box m={2}>
      <TextField
        fullWidth
        required
        variant="outlined"
        size="small"
        autoComplete="current-password"
        type="password"
        label="현재 비밀번호"
        {...useHandlar('password')}
      />
      </Box>
      <Box m={2}>
      <TextField
        fullWidth
        required
        variant="outlined"
        size="small"
        autoComplete="new-password"
        type="text"
        label="새 비밀번호"
        type="password"
        {...useHandlar('newpw')}
      />
      </Box>
      <Box m={2}>
      <TextField
        fullWidth
        required
        variant="outlined"
        size="small"
        autoComplete="new-password"
        type="text"
        label="새 비밀번호 확인"
        type="password"
        {...useHandlar('newpwCheck')}
      />
      </Box>
      <Box m={2}>
      <Button
        disabled={disabled}
        variant="contained"
        color="primary"
        onClick={e => getValues(handleSubmit)}
      >
        변경
      </Button>
      </Box>
    </Grid>
  </>);
}
