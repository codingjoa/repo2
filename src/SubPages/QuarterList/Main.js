import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from './List';
import Page from '../../Templates/Page';
import Tools from './Tools';
import { Context } from './Context';
import { getHandlar } from '../../Templates/Format';
const defaultPage = (
  <CircularProgress />
);
function fetchQuarters(
  page,
  size,
  keyword,
  callback
) {
  const offset = page * size;
  axios.get(`/api/admin/quarter?offset=${offset}&size=${size}&keyword=${keyword}`)
  .then(r => callback(null, r))
  .catch(callback);
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
export default () => {
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const callback = getHandlar(history.replace);
  // 페이지네이션
  const [ page, setPage ] = React.useState(location?.state?.previous?.page ?? 0);
  // 검색어 Ref
  const searchRef = React.useRef();
  const changePage = (
    page = 0
  ) => {
    setPage(page);
    fetchQuarters(page, 10, searchRef.current.value, callback);
  };
  React.useLayoutEffect(() => {
    changePage();
    //fetchQuarters(page, 10, '', callback);
  }, []);
  return (
    <Context.Provider
      value={{
        reload: () => changePage(page)
      }}
    >
      <Typography variant="subtitle1">팀 관리</Typography>
      <Box>
        <TextField
          fullWidth
          inputRef={searchRef}
        />
      </Box>
      <Box>
        <Button
          color="primary"
          onClick={() => changePage()}
          variant="contained"
        >
          검색
        </Button>
      </Box>
      <Tools />
      {!location.state?.status && defaultPage}
      {(location.state?.status === 400 && location.state?.message) ?? '알 수 없는 오류입니다.'}
      {location.state?.status === 404 &&
        <>팀이 없습니다. 새 팀을 생성하세요.</>
      }
      {location.state?.status === 200 &&
        <>
          <List
            rows={location.state?.data.rows}
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
