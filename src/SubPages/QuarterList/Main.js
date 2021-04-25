import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import List from './List';
import Tools from './Tools';
import Search from './Search';
import { Context } from './Context';
import { getHandlar } from '../../Templates/Format';
const defaultPage = (
  <CircularProgress />
);
function fetchQuarters(callback) {
  axios.get(`/api/admin/quarter`)
  .then(r => callback(null, r))
  .catch(callback);
}

export default () => {
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const callback = getHandlar(history.replace);
  const [ searchKeyword, setSearchKeyword ] = React.useState('');
  React.useLayoutEffect(() => {
    fetchQuarters(callback);
  }, []);
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
        reload: () => fetchQuarters(callback)
      }}
    >
      <Typography variant="subtitle1">팀 관리</Typography>
      <Search setSearchKeyword={setSearchKeyword} />
      <Tools />
      {!location.state?.status && defaultPage}
      {(location.state?.status === 400 && location.state?.message) ?? '알 수 없는 오류입니다.'}
      {location.state?.status === 404 &&
        <>팀이 없습니다. 새 팀을 생성하세요.</>
      }
      {location.state?.status === 200 &&
        <List
          rows={location.state?.data.filter(filtering)}
        />
      }
    </Context.Provider>
  );
}
