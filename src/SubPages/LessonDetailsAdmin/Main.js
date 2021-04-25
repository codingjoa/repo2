import React from 'react';
import * as ReactRouter from 'react-router-dom';
import { getHandlar } from '../../Templates/Format';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import General from './General';
import Checking from './Checking';
const defaultPage = (
  <CircularProgress />
);
function fetchDetails(callback, { quarterID, lessonMonth }) {
  axios.get(`/api/admin/lesson/details/${quarterID}/${lessonMonth}`)
  .then(r => callback(null, r), callback)
}

export default () => {
  const history = ReactRouter.useHistory();
  const location = ReactRouter.useLocation();
  const { quarterID, lessonMonth } = ReactRouter.useParams();
  const callback = getHandlar(history.replace);
  React.useLayoutEffect(() => {
    fetchDetails(callback, { quarterID, lessonMonth });
  }, []);
  return (
    <>
      {!location?.state?.status && defaultPage}
      {location.state?.status === 404 && <>조회된 정보 없음.</>}
      {location.state?.status === 400 && <>알 수 없는 오류.</>}
      {location.state?.status === 200 &&
      <>
        <General
          {...location.state?.data}
        />
        <Checking
          studySize={location.state?.data.studySize}
          students={location.state?.data.students}
        />
      </>
      }
    </>
  );
}
