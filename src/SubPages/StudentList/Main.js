import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
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
    result => callback(null, result.data.fetchedData),
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
  alert(typeof list);
  sorted[Symbol.iterator] = /*Object.entries(list)*/Array.from(list).sort(

  ).map(([ key, val ]) => (key));
}

const sorted = {
  order: null,
  asc: null
};
let list = null;
let key = null;
let pageSize = 0;

export default function() {
  const [ fd, setFd ] = React.useState(null);
  const [ searchKeyword, setSearchKeyword ] = React.useState('');
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  React.useLayoutEffect(() => {
    /*
    if(fd !== null) return;
    axios.get(`/api/admin/student`)
    .then(r => setFd(r.data.fetchedData))
    .catch(e => {
      e.request && setFd(1);
      e.response && setFd(e.response.status);
    });
    */
  }, [ fd ]);

  React.useLayoutEffect(() => {
    list = null;
    fetchStudents((err, result) => {
      if(err) {
        setFd(404);
        return;
      }
      list = result;
      alert(result);
      history.push('/admin/student?asc=0');
      //Math.ceil(result.length / 10);
      //list = new Map();
    });
  }, []);
  React.useLayoutEffect(() => {
    if(list === null) {
      return;
    }
    const query = queryString.parse(location.search);
    const asc = query?.asc ?? 1;
    const page = query?.page ?? 1;
    sort({
      asc
    })
    setFd(8);
    //list[][0]
    //key =
  }, [ location ]);
  const filtering = React.useCallback(value => {
/* @codingjoa
   RegExp(정규식)을 이용하기 때문에
   중간, 끝 문자 일치시에도 불러올 수 있어요.
*/
    const rg = new RegExp(searchKeyword ?? '', 'gi');
    return rg.test(value.studentName);
  }, [ searchKeyword ]);
  if(!fd) return (<CircularProgress />);
  if(fd === 8) {
    return (
      <>
        <List list={Array.from(sorted)} />
      </>
    );
  }
  return (
    <>ang</>
  );

  /*
  return (
    <Context.Provider
      value={{
        reload: () => setFd(null)
      }}
    >
      <Typography variant="subtitle1">학생 관리</Typography>
      <Search setSearchKeyword={setSearchKeyword} />
      <Toolbar />
      {fd === 404 &&
        <>학생이 없습니다.</>
      }
      {typeof fd === 'object' &&
        <List list={fd.filter(filtering)} />
      }
    </Context.Provider>
  );
*/
}
