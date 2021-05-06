import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import List from './List';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
function fetchList(
  page,
  size,
  keyword,
  callback
) {
  const offset = page * size;
  axios.get(`/api/teacher/lesson?offset=${offset}&size=${size}&keyword=${keyword}`)
  .then(r => callback(null, r, { page, keyword }))
  .catch(callback);
}
function PureLayer({
  searchRef,
  handleClick
}) {
  return (
    <Page>
      <Box
        display="flex"
      >
        <Box
          alignSelf="center"
          flexGrow={1}
        >
          <TextField
            fullWidth
            InputProps={{ onKeyDown: (e => e.keyCode == 13 && handleClick())}}
            inputRef={searchRef}
            label="팀 이름으로 검색"
            size="small"
            variant="outlined"
          />
        </Box>
        <Box
          ml={2}
        >
          <Button
            color="primary"
            onClick={() => handleClick()}
            variant="contained"
          >
            검색
          </Button>
        </Box>
      </Box>
    </Page>
  );
}
export default () => {
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const [ status, setStatus ] = React.useState(null);
  // 페이지네이션
  const [ page, setPage ] = React.useState(location?.state?.previous?.page ?? 0);
  const searchRef = React.useRef();
  const handleClick = (page = 0) => {
    setPage(page);
    fetchList(page, 5, searchRef.current.value, handleState);
  };
  const handleState = (err, result) => {
    if(err) {
      setStatus(err.response.status);
      return;
    }
    setStatus(result.status);
    history.replace({
      state: {
        data: result.data.fetchedData
      }
    });
  }
  React.useLayoutEffect(() => {
    if(location?.state?.previous?.keyword !== undefined) {
      searchRef.current.value = location?.state?.previous?.keyword;
    }
    fetchList(page, 5, location?.state?.previous?.keyword ?? '', handleState);
  }, []);
  return (
    <>
      <Typography variant="subtitle1">
        담당중인 출석부
      </Typography>
      <PureLayer
        searchRef={searchRef}
        handleClick={handleClick}
      />
      {status === null && <CircularProgress />}
      {status === 404 && <>{sessionStorage?.teacherName ?? '???'} 선생님은 담당중인 수업이 없으십니다.</>}
      {status === 400 && <>알 수 없는 오류.</>}
      {status === 200 &&
        <>
        <List list={location?.state?.data?.rows} />
        <DependencyPaginationButtons
          page={page}
          pageSize={location?.state?.data?.totalPage}
          handleClick={handleClick}
        />
      </>
      }
    </>
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
