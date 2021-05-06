import React from 'react';
import * as ReactRouter from 'react-router-dom';
import { getHandlar } from '../../Templates/Format';
import { useSelector } from '../../Templates/SelectingMonth';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from './List';
import Page from '../../Templates/Page';
import Search from './Search';
import { Context } from './Context';
const defaultPage = (
  <CircularProgress />
);
function fetchLessonsAdmin(year, month, page, onePageSize, keyword, callback) {
  const len = (`${month}`.length === 1);
  const lessonMonth= `${year}-${len ? '0' : ''}${month}-01`;
  const offset = page * onePageSize;
  axios.get(`/api/admin/lesson/wait/${lessonMonth}?offset=${offset}&size=${onePageSize}&keyword=${keyword}`)
  .then(
    result => callback(null, result, { year, month, page, keyword }),
    err => callback(err, null, { year, month, page, keyword })
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
  const [ page, setPage ] = React.useState(location.state?.previous?.page ?? 0);
  // 검색 필터링 관련
  const searchRef = React.useRef();
  //const [ searchKeyword, setSearchKeyword ] = React.useState('');
  const changePage = (page = 0) => {
    history.replace({
      state: null
    });
    setPage(page);
    fetchLessonsAdmin(
      year,
      month,
      page,
      10,
      searchRef.current.value,
      callback
    );
  };
  // 페이지 첫 로드시 무조건 fetch
  React.useLayoutEffect(() => {
    searchRef.current.value = location?.state?.previous?.keyword ?? '';
    fetchLessonsAdmin(
      year,
      month,
      page,
      10,
      location?.state?.previous?.keyword ?? '',
      callback
    );
  }, []);
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
              onClick={e => changePage()}
              variant="contained"
            >
              조회
            </Button>
          )}
        />
        <Box
          mt={1}
        >
          <TextField
            fullWidth
            inputRef={searchRef}
            label="팀 또는 강사 이름으로 검색"
            InputProps={{ onKeyDown: (e => e.keyCode == 13 && changePage())}}
            size="small"
            variant="outlined"
          />
        </Box>
      </Page>
      {!location?.state?.status && defaultPage}
      {location?.state?.status === 400 && <>알 수 없는 오류.</>}
      {location?.state?.status === 404 && <>{location.state?.previous?.year}년 {location.state?.previous?.month}월 등록된 수강 내역이 없습니다.</>}
      {location?.state?.status === 200 &&
      <>
        <List
          list={location.state.data.rows}
          reload={() => fetchLessonsAdmin(year, month, page, 10, searchRef.current.value, callback)}
        />
        <DependencyPaginationButtons
          handleClick={changePage}
          page={page}
          pageSize={location?.state?.data?.totalPage ?? null}
        />
      </>
      }
    </Context.Provider>
  );

}


function DependencyPaginationButtons({
  page,
  pageSize,
  handleClick
}) {
  const BarSize = 5;
  // 불변의 렌더링된 모든 버튼들
  const inActivated = React.useMemo(() => {
    const buttons = [];
    for(let i=0; i<pageSize; i++) {
      buttons[i] = (
        <Box
          key={`inActivated:${i}`}
          m={0.25}
        >
          <Button
            onClick={e => handleClick(i)}
            size="small"
            style={{ minWidth: '3rem', maxWidth: '3rem' }}
            variant="outlined"
          >
            {i+1}
          </Button>
        </Box>
      );
    }
    return buttons;
  }, [
    pageSize
  ]);
  const Activated = React.useMemo(() => {
    const buttons = [];
    for(let i=0; i<pageSize; i++) {
      buttons[i] = (
        <Box
          key={`Activated:${i}`}
          m={0.25}
        >
          <Button
            color="primary"
            size="small"
            style={{ minWidth: '3rem', maxWidth: '3rem' }}
            variant="contained"
          >
            {i+1}
          </Button>
        </Box>
      );
    }
    return buttons;
  }, [
    pageSize
  ]);
  // pageSize가 없다면 버튼을 그리지 않습니다.
  if(pageSize === null) {
    return null;
  }
  // 버튼 목록 그리기
  const pageLevel = Math.floor(page * (1 / BarSize));
  const pagination = [];
  let i = pageLevel * BarSize;
  while(i < (pageLevel * BarSize) + BarSize && i < pageSize) {
    pagination[i] = (page === i) ? Activated[i] : inActivated[i];
    i++;
  }
  return (
    <Page>
      <Box
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        {i-BarSize>0 &&
          <Box
            m={0.25}
          >
            <Button
              onClick={e => handleClick(i - BarSize - 1)}
              size="small"
              style={{ minWidth: '3rem', maxWidth: '3rem' }}
              variant="outlined"
            >
              &lt;
            </Button>
          </Box>
        }
        {pagination}
        {i<pageSize &&
          <Box
            m={0.25}
          >
            <Button
              onClick={e => handleClick(i)}
              size="small"
              style={{ minWidth: '3rem', maxWidth: '3rem' }}
              variant="outlined"
            >
              &gt;
            </Button>
          </Box>
        }
      </Box>
    </Page>
  );
}
