import React from 'react';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
function addRefund(state, callback) {
  if(!state) return;
  if(!state?.p) {
    closeLesson(state, callback);
    return;
  }
  const { quarterID, lessonMonth } = state;
  axios.post(`/api/admin/lesson/refund/${quarterID}/${lessonMonth}`, {refunds: state.p})
  .then(r => closeLesson(state, callback))
  .catch(callback);
}
function closeLesson(state, callback) {
  const { quarterID, lessonMonth } = state;
  axios.put(`/api/admin/lesson/${quarterID}/${lessonMonth}`)
  .then(r => callback(null, r))
  .catch(callback);
}

export default () => {
  const location = useLocation();
  const history = useHistory();
  const submit = () => {
    addRefund(location.state, (err, result) => {
      if(err) {
        alert(`오류가 발생했습니다: ${err}`);
alert(err.response.data.cause);
        return;
      }
      const lessonMonth = location?.state?.lessonMonth;
      const regex = /^(\d{4})\-(\d{1,2})\-\d{1,2}/;
      if(regex.test(lessonMonth)) {
        history.push('/admin/calculator');
      }
      const [ _, year, month ] = regex.exec(lessonMonth);
      history.push({
        pathname: '/admin/calculator',
        state: {
          year,
          month
        }
      });
    });
  };
  return (
    <Grid item xs={12}>
      <Box display="flex" justifyContent="center">
        <Typography variant="h6">
          수업 마감을 진행 하시겠습니까?
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <Box m={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={submit}
          >
            확인
          </Button>
        </Box>
      </Box>
    </Grid>
  );

};
