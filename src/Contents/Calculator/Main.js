import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import SelectingMonth from './SelectingMonth';
import List from './List';
import Page from '../../Templates/Page';
import { Context } from './Context';
function calculateProceeds({ lessonMonth }, callback) {
  Promise.all([
    axios.get(`/api/admin/lesson/ended/${lessonMonth}`)
  ])
  .then(r => callback(null, r))
  .catch(callback);
}
const DO = new Date();

export default () => {
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const year = location?.state?.year ?? DO.getFullYear();
  const month = location?.state?.month ?? DO.getMonth()+1;
  const [ status, setStatus ] = React.useState(null);
  const [ lessonList, setLessonList ] = React.useState(null);
  React.useLayoutEffect(() => {
    calculateProceeds({ lessonMonth: `${year}-${month}-01` }, (err, result) => {
      if(err) {
        setStatus(err?.response.status ?? 400);
        return;
      }
      setLessonList(result[0].data.fetchedData);
      setStatus(200);
    });
  }, [ location.state ]);
  return (
    <Context.Provider
      value={{
        year,
        month,
        reload: e => history.replace({ state: { year, month }})
      }}
    >
      <Page><SelectingMonth /></Page>
      {status === 404 && <>{year}년 {month}월 수업 결과가 존재하지 않습니다.</>}
      {status === 200 && <List list={lessonList} />}
    </Context.Provider>
  );
}
