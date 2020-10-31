import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import General from './General';
import Checking from './Checking';
function fetchDetails(callback, { quarterID, lessonMonth }) {
  axios.get(`/api/admin/lesson/details/${quarterID}/${lessonMonth}`)
  .then(r => callback(null, r))
  .catch(callback);
}

export default () => {
  const [ status, setStatus ] = React.useState(null);
  const [ checking, setChecking ] = React.useState(null);
  const [ general, setGeneral ] = React.useState(null);
  const { quarterID, lessonMonth } = useParams();
  const handleState = (err, result) => {
    if(err) {
      setStatus(err.response.status);
      return;
    }
    setChecking(result.data.fetchedData.checking);
    setGeneral(result.data.fetchedData.general);
    setStatus(result.status);
  }
  React.useLayoutEffect(() => {
    fetchDetails(handleState, { quarterID, lessonMonth });
  }, []);
  return (
    <>
      {status === 404 && <>조회된 정보 없음.</>}
      {status === 400 && <>알 수 없는 오류.</>}
      {status === 200 &&
      <>
        <General {...general} />
        <Checking checking={checking} />
      </>
      }
    </>
  );
}
