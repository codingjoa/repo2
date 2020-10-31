import React from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import List from './List';
const DO = new Date();

export default function() {
  const [ fd, setFd ] = React.useState(null);
  React.useLayoutEffect(() => {
    if(fd) return;
    axios.get('/api/admin/lesson/available')
    .then(r => setFd(r.data.fetchedData))
    .catch(e => {
      e?.request && setFd(1);
      e?.response && setFd(e.response.status);
    });
  }, [ fd ]);
  if(!fd) return (<CircularProgress />);
  return (
    <>
      {fd === 404 && 
        <>{DO.getMonth()+1}월 달 등록된 수강 내역이 없습니다. 수강 등록을 먼저 진행하세요.</>
      }
      {typeof fd === 'object' &&
        <>
        <Typography variant="subtitle1">
          선생님 수업 배정
        </Typography><br />
        <List list={fd} />
        </>
      }
    </>
  );
}
