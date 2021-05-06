import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
function fetchMyQuarters(
  page,
  size,
  keyword,
  callback
) {
  const offset = page * size;
  axios.get(`/api/teacher/quarter?offset=${offset}&size=${size}&keyword=${keyword}`)
  .then(r => callback(null, r, { page, keyword }))
  .catch(callback);
}
function deleteQuarterStudents(studentID, callback) {
  axios.delete(`/api/teacher/student/${studentID}/quarter`)
  .then(result => callback(null, result), callback);
}
function Quarters404({
  status
}) {
  if(status === 404) {
    return (<>
      {sessionStorage?.teacherName ?? '???'} 선생님은 담당중인 수업이 없으십니다.
    </>);
  }
  return null;
}
function Quarters() {
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const [ fd, setFd ] = React.useState(null);
  const [ page, setPage ] = React.useState(location?.state?.quarters?.page ?? 0);
  const searchRef = React.useRef();
  const callback = (err, result, quarters) => {
    if(err) {
      setFd({
        message: err?.response?.data?.cause ?? '알 수 없는 오류',
        status: err?.response?.status ?? 400
      });
      return;
    }
    setFd({
      data: result.data?.fetchedData,
      status: 200
    });
    const students = location?.state?.students ?? null;
    history.replace({
      state: {
        quarters,
        students
      }
    });
  };
  const handleClick = (page = 0) => {
    setPage(page);
    setFd(null);
    fetchMyQuarters(page, 5, searchRef.current.value, callback);
  }
  React.useLayoutEffect(() => {
    const keyword = location?.state?.quarters?.keyword ?? '';
    searchRef.current.value = keyword;
    fetchMyQuarters(page, 5, keyword, callback);
  }, []);
  return (
    <>
      <Typography variant="subtitle1">담당 팀 관리</Typography>
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
            ml={1}
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
      <DefaultPage
        status={fd?.status ?? null}
      />
      <QuarterList
        rows={fd?.data?.rows ?? null}
        reload={() => handleClick(page)}
      />
      <Quarters404
        status={fd?.status ?? null}
      />
      <DependencyPaginationButtons
        page={page}
        pageSize={fd?.data?.totalPage ?? null}
        handleClick={handleClick}
      />
    </>
  );
}
function QuarterStudentTableRow(row, reload) {
  const history = ReactRouter.useHistory();
  const handleDelete = e => {
    const userAnswer = window.confirm(`${row[1]}학생을 팀에서 해제시킵니다.`);
    if(!userAnswer) {
      return;
    }
    deleteQuarterStudents(row[0], (err, result) => {
      if(err) {
        alert(err?.response.data?.cause ?? err);
        return;
      }
      reload();
    });
  };
  const handleClick = e => {
    history.push(`/student/detail/${row[0]}`);
  };
  return (
    <Box
      key={row[0]}
      m={1}
    >
      <Chip
        clickable
        label={row[1]}
        onClick={handleClick}
        onDelete={handleDelete}
        size="small"
        variant="outlined"
      />
    </Box>
  );
}
function QuarterRowInfo(row, reload) {
  const history = ReactRouter.useHistory();
  const handleClick = () => {
    history.push(`/quarter/${row.quarterID}/student`);
  };
  return (
    <Page
      key={row.quarterID}
    >
      <Typography
        color="primary"
        variant="h6"
      >
        {row.quarterName}
      </Typography>
      <Typography variant="subtitle1">학생 목록</Typography>
      <Box
        display="flex"
      >
        <Grid
          container
        >
          {row.students!==null && row.students.map(row => QuarterStudentTableRow(row, reload))}
          <Box
            m={1}
          >
            <Chip
              clickable
              icon={<AddCircleIcon />}
              onClick={handleClick}
              size="small"
            />
          </Box>
        </Grid>
      </Box>
    </Page>
  );
}
function QuarterList({
  rows,
  reload
}) {
  if(rows instanceof Array) {
    const dom = rows.map(row => QuarterRowInfo(row, reload));
    return dom;
  } else {
    return null;
  }
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
function DefaultPage({
  status
}) {
  if(status === null) {
    return (<CircularProgress />);
  }
  return null;
}

export default Quarters;
