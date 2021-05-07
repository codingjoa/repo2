import React from 'react';
import * as ReactRouter from 'react-router-dom';
import { getHandlar } from '../../Templates/Format';
import { useSelector } from '../../Templates/SelectingMonth';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import List from './List';
const DO = new Date();
const defaultPage = (
  <CircularProgress />
);
function fetchAvailableLesson(
  callback
) {
  axios.get('/api/admin/lesson/available')
  .then(result => callback(null, result), callback);
}

export default function() {
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const callback = getHandlar(history.replace);
  const { year, month, YearSelector } = useSelector();
  /*
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
  if(!fd) return ();
  */
  React.useLayoutEffect(() => {
    if(!location.state?.status) {
      fetchAvailableLesson(callback);
    }
  }, [ location ]);
  return (
    <>
      <YearSelector
        submitButton={(
          <Button
            color="primary"
            onClick={e => alert(`${year} ${month}`)}
            variant="contained"
          >
            조회
          </Button>
        )}
      />
      {!location.state?.status && defaultPage}
      {(location.state?.status === 400 && location.state?.message) ?? '알 수 없는 오류입니다.'}
      {location.state?.status === 404 &&
        <>{DO.getMonth()+1}월 달 등록된 수강 내역이 없습니다. 수강 등록을 먼저 진행하세요.</>
      }
      {location.state?.status === 200 &&
        <>
          <Typography variant="subtitle1">
            선생님 수업 배정
          </Typography><br />
          <List list={location.state?.data} />
        </>
      }
    </>
  );
}
