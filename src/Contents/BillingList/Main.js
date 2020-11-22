import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import List from './List';
import Tools from './Tools';
import Register from './Register';
import { Context } from './Context';
import Handlar from './Handlar';

function fetchQuarterList({ year, month }, callback) {
  axios.get(`/api/admin/billing/available/quarter/${year}-${month}-01`)
  .then(r => callback(null, r))
  .catch(callback);
}
function addBilling({ reqIter, year, month }, callback) {
  axios.post(`/api/admin/billing/${year}-${month}-1`, { reqIter })
  .then(r => callback(null, r))
  .catch(callback);
}

const DO = new Date();
let handleSubmit = () => {};
function fetchBillingList({ year: needYear, month: needMonth }, callback) {
  const currentYear = DO.getFullYear();
  const currentMonth = DO.getMonth()+1;
  let isPast = true;
  if(currentYear < needYear) isPast = false;
  else if(currentYear === needYear && currentMonth <= needMonth) isPast = false;
  const pathname = isPast ? `/api/admin/billing/registered/${needYear}-${needMonth}-01` : `/api/admin/billing/all/${needYear}-${needMonth}-01`; 
  axios.get(pathname)
  .then(r => callback(null, r))
  .catch(callback);
}

export default function() {
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const year = location?.state?.year ?? DO.getFullYear();
  const month = location?.state?.month ?? DO.getMonth()+1;
  const [ fd, setFd ] = React.useState(null);
  const [ status, setStatus ] = React.useState(null);
  const [ searchKeyword, setSearchKeyword ] = React.useState('');
  // 학생 체크박스가 1개 이상이고 모두 등록되어 있을 경우
  const [ disabled, setDisabled ] = React.useState(true);
  const reload = () => {
    history.replace({
      state: { year, month }
    });
  };
  React.useLayoutEffect(() => {
    const isCanBeSubmit = ok => {
      setDisabled(!ok);
    };
    function submit(err, values) {
      if(err) {
        alert(err);
        return;
      }
      const r = window.confirm(`${values[0].name} 학생 등 ${values.length}명의 입금을 등록하시겠습니까?`);
      if(!r) {
        return;
      }
      addBilling({
        year,
        month,
        reqIter: values.map(({ studentID, quarterID, billingGroup, billingPayment, billingPrice }) => ({ studentID, quarterID, billingGroup, billingPayment, billingPrice }))
      },(err, result) => {
        if(err) {
          alert(err?.response?.data?.cause ?? err);
          return;
        }
        reload();
      });
    }
    const { useState, handleSubmit: handlarSubmit } = Handlar(null, submit, isCanBeSubmit);
    handleSubmit = handlarSubmit;
    fetchQuarterList({ year, month }, (err, result) => {
      if(err) {
        return;
      }
      const quarters = result.data.fetchedData;
      fetchBillingList({ year, month }, (err, result) => {
        if(err) {
          err?.request && setStatus(1);
          err?.response && setStatus(err.response.status);
          return;
        }
        setFd(result.data.fetchedData.map(row => {
          const dom = row.Registered ? (<List {...row} />):(<Register {...row} useState={useState} QuarterList={quarters} />);
          return {
            studentName: row.studentName,
            quarterName: row.quarterName,
            dom
          };
        }));
        setStatus(200);
      });
    })
  }, [ location.state ]);

  const filtering = React.useCallback(value => {
/* @codingjoa
   RegExp(정규식)을 이용하기 때문에
   중간, 끝 문자 일치시에도 불러올 수 있어요.
*/
    const rg = new RegExp(searchKeyword ?? '', 'gi');
    return rg.test(value.studentName) || rg.test(value.quarterName);
  }, [ searchKeyword ]);
  return (
    <Context.Provider
      value={{
        year,
        month,
        reload
      }}
    >
      <Typography variant="subtitle1">학생 수업 배정</Typography>
      {/*<Search setSearchKeyword={setSearchKeyword} />*/}
      <Tools handleSubmit={handleSubmit} disabled={disabled} />
      {status === 0 &&
        <CircularProgress />
      }
      {status === 400 &&
        <>오류가 발생했습니다.</>
      }
      {status === 404 &&
        <>{year}년 {month}월 배정된 학생 수업이 없습니다.</>
      }
      {status === 200 && fd &&
        fd.filter(filtering).map(({ dom }) => dom)
      }
    </Context.Provider>
  );

}
