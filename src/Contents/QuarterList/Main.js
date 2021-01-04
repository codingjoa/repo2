import React from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import List from './List';
import Tools from './Tools';
import Search from './Search';
import { Context } from './Context';
function fetchQuarters(callback) {
  axios.get(`/api/admin/quarter`)
  .then(r => callback(null, r))
  .catch(callback);
}

let fd, status;

export default () => {
  const [ count, setCount ] = React.useState(null);
  const [ searchKeyword, setSearchKeyword ] = React.useState('');
  React.useLayoutEffect(() => setCount(0), []);
  React.useLayoutEffect(() => {
    if(count !== 0) return;
    fetchQuarters((err, result) => {
      if(err) {
        if(!err?.response?.status) {
          alert(err);
          status = 400;
          setCount(count => count+1);
          return;
        }
        else if(err.response.status === 400) {
          alert(err.response.data.cause);
        }
        status = err.response.status;
        setCount(count => count+1);
        return;
      }
      fd = result.data.fetchedData;
      status = 200;
      setCount(count => count+1);
    });
  }, [ count ]);
  const filtering = React.useCallback(value => {
/* @codingjoa
   RegExp(정규식)을 이용하기 때문에
   중간, 끝 문자 일치시에도 불러올 수 있어요.
*/
    const rg = new RegExp(searchKeyword ?? '', 'gi');
    return rg.test(value.quarterName);
  }, [ searchKeyword ]);
  return (
    <Context.Provider
      value={{
        reload: () => setCount(0)
      }}
    >
      <Typography variant="subtitle1">반 관리</Typography>
      <Search setSearchKeyword={setSearchKeyword} />
      <Tools />
      {count === 0 ?
        <CircularProgress /> :
        <>
          {status === 404 && 
            <>반이 없습니다. 새 반을 생성하세요.</>
          }
          {status === 200 && fd &&
            <List list={fd.filter(filtering)} />
          }
        </>
      }
    </Context.Provider>
  );
}
