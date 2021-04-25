import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import { getHandlar } from '../../Templates/Format';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Search from './Search';
import List from './List';
import Toolbar from './Toolbar';
import { Context } from './Context';
function fetchStudents (
  callback
) {
  axios.get(`/api/admin/student`).then(
    result => callback(null, result),
    callback
  );
}
function sort({
  order = 'default',
  asc = true,
  type = 'number'
}) {
  if(sorted.order === order && sorted.asc === asc) {
    return;
  }
  sorted.order = order;
  sorted.asc = asc;
  //sorted[Symbol.iterator]
  const r = /*Object.entries(list)*/Object.entries(sortable).sort(
    (a, b) => (a[0] - b[0])
  ).map(([ key, val ]) => (key));
  alert(Object.entries(sortable));
  return r.map((key) => (
    <>
      <List
        {...sortable.get(key)}
      />
    </>
  ));
}

const sorted = {
  order: null,
  asc: null
};
let sortable = null;

let key = null;
let pageSize = 0;

const defaultPage = (
  <CircularProgress />
);
const error404 = (
  <>
    학생이 없습니다.
  </>
);
export default function() {
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const callback = getHandlar(history.replace);

  const [ fd, setFd ] = React.useState(null);
  const [ searchKeyword, setSearchKeyword ] = React.useState('');
  React.useLayoutEffect(() => {
/* @codingjoa
   history.back() 을 했을 때는 이 LayoutEffect가 실행됩니다.
   정보를 변경하는 페이지를 거친 다음 돌아왔을 때 변동사항을 바로 보여줄 수 있는 장점이 있습니다.
   하지만 ReactRouter의 Link to="..."을 했을 때는 이LayoutEffect가 실행되지 않아서 location을 다시 사용해야 합니다.
*/
    fetchStudents(callback);
  }, []);
  React.useLayoutEffect(() => {
    //result = result0
    //history.replace('?asc=1&page=1');
    /*
    const query = queryString.parse(location.search);
    const asc = query?.asc ?? 1;
    const page = query?.page ?? 1;
    const filter = query?.filter ?? '';
    const result = sort({
      asc
    })
    */
    ; // doNothing
  });

  // 필터링
  const filtering = React.useCallback(value => {
/* @codingjoa
   RegExp(정규식)을 이용하기 때문에
   중간, 끝 문자 일치시에도 불러올 수 있어요.
*/
    const rg = new RegExp(searchKeyword ?? '', 'gi');
    return rg.test(value.studentName);
  }, [ searchKeyword ]);

  return (
    <Context.Provider
      value={{
        reload: () => fetchStudents(callback)
      }}
    >
      <Typography variant="subtitle1">학생 관리</Typography>
      <Search setSearchKeyword={setSearchKeyword} />
      <Toolbar />
      {!location?.state?.status && defaultPage}
      {location?.state?.status === 400 && <>알 수 없는 오류.</>}
      {location?.state?.status === 404 && <>학생 정보가 없습니다.</>}
      {location?.state?.status === 200 &&
        location?.state?.data && location?.state?.data.map(row => <List key={row.studentID} {...row} />)
      }
    </Context.Provider>
  );

  /*
  return (



  );
*/
}
