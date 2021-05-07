import React from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import List from './List';
import Search from './Search';
import { Context } from './Context';
function fetchLessonsAdmin(callback) {
  const lessonMonth= '2021-04-01';
  axios.get(`/api/dev/admin/lesson/wait/${lessonMonth}`)
  .then(r => callback(null, r))
  .catch(callback);
}

export default function() {
  const [ status, setStatus ] = React.useState(0);
  const [ fd, setFd ] = React.useState(null);
  const [ searchKeyword, setSearchKeyword ] = React.useState('');
  React.useLayoutEffect(() => {
    fetchLessonsAdmin((err, result) => {
      if(err) {
        if(!err?.response?.status) {
          alert(err);
          setStatus(400);
          return;
        }
        else if(err.response.status === 400) {
          alert(err.response.data.cause);
        }
        setStatus(err.response.status)
        return;
      }
      setFd(result.data.fetchedData);
      setStatus(200);
    });
  }, []);
  const filtering = React.useCallback(value => {
/* @codingjoa
   RegExp(정규식)을 이용하기 때문에
   중간, 끝 문자 일치시에도 불러올 수 있어요.
*/
    const rg = new RegExp(searchKeyword ?? '', 'gi');
    const r = !rg.test(value.quarterName) ? !rg.test(value.teacherName) ? false : true : true;
    return r;
    //return rg.test(value.quarterName || value.teacherName);
  }, [ searchKeyword ]);
  return (
    <Context.Provider
      value={{
        reload: () => setFd(null)
      }}
    >
      <Typography variant="subtitle1">수업 조회/마감</Typography>
      <Search setSearchKeyword={setSearchKeyword} />
      {status === 0 &&
        <CircularProgress />
      }
      {status === 404 &&
        <>이번 달 등록된 수강 내역이 없습니다.</>
      }
      {status === 400 &&
        <>알 수 없는 오류.</>
      }
      {status === 200 && fd &&
        <>
          {/*<List list={fd.canbeClosedLesson.filter(filtering)} isCanBeClosed={true} />
          <List list={fd.lesson.filter(filtering)} isCanBeClosed={false} />*/}
          <List list={fd.filter(filtering)} isCanBeClosed={true} />
        </>
      }
    </Context.Provider>
  );

}

/*
  <Page>
        <Link to={`/admin/lesson/detail/${row.quarterID}/${toDateFormat(row.lessonMonth)}`}>
          <Box display="flex" flexDirection="row" flexWrap="noWrap">
            <Box alignSelf="center" flexGrow={1}>{row.quarterID}({row.teacherAccount})</Box>
          </Box>
        </Link></Page>)}<br />
      <Typography variant="subtitle1">진행중인 출석부</Typography>
      {fd && fd.lesson.map(row => <Page>
        <Link to={`/admin/lesson/detail/${row.quarterID}/${toDateFormat(row.lessonMonth)}`}>
          <Box display="flex" flexDirection="row" flexWrap="noWrap">
            <Box alignSelf="center" flexGrow={1}>{row.quarterName}({row.lessonMonth})</Box>
          </Box>
        </Link></Page>)}
    </>
  );
*/
