import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import { getHandlar } from '../../Templates/Format';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from './List';
import Page from '../../Templates/Page';
import StudentAdd from './StudentAdd';
function fetchStudents (
  page,
  onePageSize,
  keyword,
  callback,
  callback2 = null
) {
  const offset = page * onePageSize;
  axios.get(`/api/admin/student?offset=${offset}&size=${onePageSize}&keyword=${keyword}`).then(
    result => {
      callback(null, result, { page, keyword });
      callback2 && callback2();
    },
    callback
  );
}
let renderCount = 0;


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
            label="팀 또는 학생 이름으로 검색"
            size="small"
            variant="outlined"
          />
        </Box>
        <Box
          ml={2}
          mr={2}
        >
          <Button
            color="primary"
            onClick={() => handleClick()}
            variant="contained"
          >
            검색
          </Button>
        </Box>
        <StudentAdd />
      </Box>
    </Page>
  );
}

export default function() {
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const callback = getHandlar(history.replace);
  // 페이지네이션
  const [ page, setPage ] = React.useState(location?.state?.previous?.page ?? 0);
  // 검색어 키워드 state
  const searchRef = React.useRef();
  const handleClick = (page = 0) => {
    const targetPage = (location?.state?.totalPage < page) ? (location?.state?.totalPage ?? 0) : page;
    history.replace({
      state: null
    });
    fetchStudents(
      targetPage,
      20,
      searchRef.current.value,
      callback,
      () => setPage(targetPage)
    );
  };
  React.useLayoutEffect(() => {
/* @codingjoa
   history.back() 을 했을 때는 이 LayoutEffect가 실행됩니다.
   정보를 변경하는 페이지를 거친 다음 돌아왔을 때 변동사항을 바로 보여줄 수 있는 장점이 있습니다.
   하지만 ReactRouter의 Link to="..."을 했을 때는 이LayoutEffect가 실행되지 않아서 location을 다시 사용해야 합니다.
*/
    if(location?.state?.previous?.keyword !== undefined) {
      searchRef.current.value = location?.state?.previous?.keyword;
    }
    fetchStudents(page, 20, location?.state?.previous?.keyword ?? '', callback);
  }, []);

  return (
    <>
      <Typography variant="subtitle1">학생 관리</Typography>
      <PureLayer
        searchRef={searchRef}
        handleClick={handleClick}
      />
      <PagePending status={location?.state?.status} />
      <Page404 status={location?.state?.status} />
      <Page400 status={location?.state?.status} />
      <Page200
        data={location?.state?.data}
        status={location?.state?.status}
        handleClick={handleClick}
        page={page}
      />
    </>
  );
}

function PagePending({
  status
}) {
  if(status === undefined) {
    return (<CircularProgress />);
  }
  return null;
}
function Page404({
  status
}) {
  if(status === 404) {
    return (<>학생 정보가 없습니다.</>);
  }
  return null;
}
function Page400({
  status
}) {
  if(status === 400) {
    return (<>알 수 없는 오류.</>);
  }
  return null;
}
function Page200({
  data,
  status,
  page,
  handleClick
}) {
  if(status === 200) {
    return (
      <>
        <DependencyList
          rows={data?.rows ?? null}
          handleClick={handleClick}
        />
        <DependencyPaginationButtons
          handleClick={handleClick}
          page={page}
          pageSize={data?.totalPage ?? null}
        />
      </>
    );
  }
  return null;
}
function DependencyList({
  rows,
  handleClick
}) {
  if(rows === null) {
    return null;
  }
  return (
    <Page>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>학생 이름</th>
            <th>팀 이름</th>
            <th>수업중 여부</th>
            <th>상세보기</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: 'center' }}>
        {rows.map(row => <List
          key={row.studentID}
          studentID={row.studentID}
          studentName={row.studentName}
          studentNameDup={row.studentNameDup}
          quarterName={row.quarterName}
          quarterNameLesson={row.quarterNameLesson}
          isCanBeClosed={row.isCanBeClosed}
          billingRegSize={row.billingRegSize}
          handleClick={handleClick}
        />)}
        </tbody>

      </table>
    </Page>
  );
}
