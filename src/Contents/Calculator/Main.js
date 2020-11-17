import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import SelectingMonth from './SelectingMonth';
import Proceeds from './Proceeds';
import Tax from './Tax';
import Page from '../../Templates/Page';
import { Context } from './Context';
function calculateProceeds({ lessonMonth, salary }, callback) {
  axios.get(`/api/admin/calculator/proceed/${lessonMonth}?salary=${salary}`)
  .then(r => callback(null, r))
  .catch(callback);
}
const DO = new Date();
let data = null;
let dom = (
  <>조회를 희망하는 달과 기본급을 입력 후 조회하시기 바랍니다.</>
);
let tax = null;

export default () => {
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const year = location?.state?.year ?? DO.getFullYear();
  const month = location?.state?.month ?? DO.getMonth();
  const [ count, setCount ] = React.useState(0);
  const summit = salary => {
    calculateProceeds({
      lessonMonth: `${year}-${month}-01`,
      salary
    }, (err, result) => {
      if(err) {
        if(err?.response.status === 404) {
          dom = (<>{year}년 {month}월 수업 결과가 존재하지 않습니다.</>);
        }
        else {
          dom = (<>{err?.response.status ?? '알 수 없는'} 오류.</>);
        }
        setCount(c => c+1);
        return;
      }
      data = result?.data?.fetchedData;
      dom = (<>
        <Typography variant="subtitle1">
          지출 총합
        </Typography>
          <Tax {...data?.tax} canbeClosedLesson={data?.canbeClosedLesson} />
        <Typography variant="subtitle1">
          수업료 분배 결과
        </Typography>
        <>{data?.proceeds?.map && data.proceeds.map(param => (
          <Proceeds
            {...param}
            salary={salary}
          />
        ))}
        </>
      </>);
      setCount(c => c+1);
    });
  };
  return (
    <Context.Provider
      value={{
        year,
        month,
        summit
      }}
    >
      <Page><SelectingMonth /></Page>
      {dom}
    </Context.Provider>
  );
}
