import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import General from './General';
import Uniqueness from './Uniqueness';
function fetchStudentDetails(callback, { studentID }) {
  axios.get(`/api/admin/student/${studentID}`)
  .then(r => callback(null, r))
  .catch(callback);
}

export default () => {
  const [ status, setStatus ] = React.useState(null);
  const [ fd, setFd ] = React.useState(null);
  const { studentID } = useParams();
  React.useLayoutEffect(() => {
    if(status !== null) return;
    fetchStudentDetails((err, result) => {
      if(err) {
        setStatus(err.response.status);
        return;
      }
      setFd(result.data.fetchedData);
      setStatus(200);
    }, { studentID });
  }, [ status ]);
  return (
    <>
      {status === 200 && <>
      <General {...fd}
      />
      <Uniqueness {...fd}
      />
      </>}
    </>
  );
}
