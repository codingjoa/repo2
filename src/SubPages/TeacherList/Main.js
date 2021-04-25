import React, {
  useState,
  useCallback,
  useLayoutEffect
} from 'react';
import axios from 'axios';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import List from './List';
import Tools from './Tools';
import Search from './Search';
import { Context } from './Context';

export default function() {
  const [ fd, setFd ] = useState(null);
  const [ searchKeyword, setSearchKeyword ] = useState('');
  useLayoutEffect(() => {
    if(fd !== null) return;
    axios.get(`/api/admin/teacher/`)
    .then(r => setFd(r.data.fetchedData))
    .catch(e => {
      e.request && setFd(1);
      e.response && setFd(e.response.status);
    });
  }, [ fd ]);
  const filtering = useCallback(value => {
/* @codingjoa
   RegExp(정규식)을 이용하기 때문에
   중간, 끝 문자 일치시에도 불러올 수 있어요.
*/
    const rg = new RegExp(searchKeyword ?? '', 'gi');
    return rg.test(value.teacherName) || rg.test(value.teacherAccount);
  }, [ searchKeyword ]);

  if(!fd) return (<CircularProgress />);
  if(typeof fd ==='string') return (<>{fd}</>);
  return (
    <Context.Provider
      value={{
        reload: () => setFd(null)
      }}
    >
      <Typography variant="subtitle1">강사 관리</Typography>
      <Search setSearchKeyword={setSearchKeyword} />
      <Tools />
      {fd === 404 &&
        <>등록된 강사가 없습니다.</>
      }
      {typeof fd === 'object' &&
        <List list={fd.filter(filtering)} />
      }
    </Context.Provider>
  );

}
