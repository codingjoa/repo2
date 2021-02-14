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
let status = 0;
let data = null;

export default () => {
  const [ count, setCount ] = React.useState(0);
  const { quarterID, lessonMonth } = useParams();
  const handleState = (err, result) => {
    if(err) {
      status = err?.response?.status ?? 400;
      setCount(count => count+1);
      return;
    }
    data = result.data.fetchedData;
    status = 200;
    setCount(count => count+1);
  }
  React.useLayoutEffect(() => {
    status = 0;
    data = null;
    setCount(0);
    fetchDetails(handleState, { quarterID, lessonMonth });
  }, []);
  return (
    <>
      {status === 404 && <>조회된 정보 없음.</>}
      {status === 400 && <>알 수 없는 오류.</>}
      {status === 200 &&
      <>
        <General
          {...data}
        />
        <Checking
          studySize={data.studySize}
          students={data.students}
        />
      </>
      }
    </>
  );
}
