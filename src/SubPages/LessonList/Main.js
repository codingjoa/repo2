import React from 'react';
import axios from 'axios';
import List from './List';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
function fetchList(callback) {
  axios.get(`/api/teacher/lesson`)
  .then(r => callback(null, r))
  .catch(callback);
}

export default () => {
  const [ status, setStatus ] = React.useState(null);
  const [ list, setList ] = React.useState(null);
  const handleState = (err, result) => {
    if(err) {
      setStatus(err.response.status);
      return;
    }
    setStatus(result.status);
    setList(result.data.fetchedData);
  }
  React.useLayoutEffect(() => {
    fetchList(handleState);
  }, []);
  return (
    <>
      {status === null && <CircularProgress />}
      {status === 404 && <>{sessionStorage?.teacherName ?? '???'} 선생님은 담당중인 수업이 없으십니다.</>}
      {status === 400 && <>알 수 없는 오류.</>}
      {status === 200 &&
      <>
        <Typography variant="subtitle1">
          담당중인 출석부
        </Typography>
        <List list={list} />
      </>
      }
    </>
  );
}
