import React from 'react';
import * as ReactRouter from 'react-router-dom';
import { getHandlar } from '../../Templates/Format';
import { useSelector } from '../../Templates/SelectingMonth';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import List from './List';
import Page from '../../Templates/Page';
import Search from './Search';
import { Context } from './Context';
const defaultPage = (
  <CircularProgress />
);
function fetchLessonsAdmin(year, month, callback) {
  const len = (`${month}`.length === 1);
  const lessonMonth= `${year}-${len ? '0' : ''}${month}-01`;
  axios.get(`/api/admin/lesson/wait/${lessonMonth}`)
  .then(
    result => callback(null, result, { year, month }),
    err => callback(err, null, { year, month })
  );
}

export default function() {
  // react-router 기반 fetch to state
  const history = ReactRouter.useHistory();
  const location = ReactRouter.useLocation();
  const { year, month, YearSelector } = useSelector({
    // 이전페이지인 여기로 돌아왔을 때/새로고침 했을 때, 마지막 검색 결과인 년월을 초기값으로 지정
    year: location.state?.previous?.year,
    month: location.state?.previous?.month
  });
  const callback = getHandlar(history.replace);

  // 페이지 첫 로드시 무조건 fetch
  React.useLayoutEffect(() => {
    fetchLessonsAdmin(
      year,
      month,
      callback
    );
  }, []);

  // 검색 필터링 관련
  const [ searchKeyword, setSearchKeyword ] = React.useState('');
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
        reload: () => fetchLessonsAdmin(year, month, callback)
      }}
    >
      <Typography
        variant="subtitle1"
      >
        출석부 관리
      </Typography>
      <Page>
        <YearSelector
          submitButton={(
            <Button
              color="primary"
              onClick={e => fetchLessonsAdmin(year, month, callback)}
              variant="contained"
            >
              조회
            </Button>
          )}
        />
      </Page>
      <Search setSearchKeyword={setSearchKeyword} />
      {!location?.state?.status && defaultPage}
      {location?.state?.status === 400 && <>알 수 없는 오류.</>}
      {location?.state?.status === 404 && <>{location.state?.previous?.year}년 {location.state?.previous?.month}월 등록된 수강 내역이 없습니다.</>}
      {location?.state?.status === 200 &&
      <>
        <List
          list={location.state.data.filter(filtering)}
          reload={() => fetchLessonsAdmin(year, month, callback)}
        />
      </>
      }
    </Context.Provider>
  );

}
