import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import General from './General';
import StudyList from './StudyList';
import StudentList from './StudentList';
function fetchDetails(callback, { quarterID, lessonMonth }) {
  axios.get(`/api/dev/teacher/lesson/${quarterID}/${lessonMonth}`)
  .then(r => callback(null, r))
  .catch(callback);
}

export default () => {
  const [ count, setCount ] = React.useState(0);
  const history = ReactRouter.useHistory();
  const location = ReactRouter.useLocation();
  const { quarterID, lessonMonth } = ReactRouter.useParams();
  const handleState = (err, result) => {
    if(err) {
      history.replace({
        state: {
          status: err.response.status ?? 400,
          message: err.response.data.cause
        }
      });
      return;
    }
    history.replace({
      state: {
        status: 200,
        data: result.data.fetchedData
      }
    });
  }
  React.useLayoutEffect(() => {
    fetchDetails(handleState, { quarterID, lessonMonth });
  }, []);
  return (
    <>
      {!location?.state?.status && <>...</>}
      {!location?.state?.status === 404 && <>조회된 정보 없음.</>}
      {location?.state?.status === 400 && <>알 수 없는 오류.</>}
      {location?.state?.status === 200 &&
      <>
        <General {...location.state.data}/>
        <StudyList />
        {location.state.data.students && <StudentList students={location.state.data.students}/>}
      </>
      }
    </>
  );
}
