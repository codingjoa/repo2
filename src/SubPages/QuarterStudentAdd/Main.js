import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import { getHandlar } from '../../Templates/Format';
import FormHandlar from '../../Templates/FormHandlar';
import Page from '../../Templates/Page';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import StudentAdd from './StudentAdd';
import Typography from '@material-ui/core/Typography';
function fetchIndependentStudents(page, onePageSize, callback) {
  const offset = page * onePageSize;
  axios.get(`/api/teacher/students?offset=${offset}&size=${onePageSize}`)
  .then(result => callback(null, result), callback);
}
function addQuarterStudents(op, quarterID, values, callback) {
  if(op) {
    axios.post(`/api/admin/students/${quarterID}`, {
      students: Object.entries(values).filter(row => row[1] === true).map(row => row[0])
    })
    .then(result => callback(null, result), callback);
  } else {
    axios.post(`/api/teacher/students/${quarterID}`, {
      students: Object.entries(values).filter(row => row[1] === true).map(row => row[0])
    })
    .then(result => callback(null, result), callback);
  }
}
function List({
  handlar,
  op
}) {
  // checkbox handlar
  const { quarterID } = ReactRouter.useParams();
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const handleSubmit = () => {
    handlar.getValues(values => {
      addQuarterStudents(op, quarterID, values, err => {
        if(err) {
          alert(err?.response.data?.cause ?? err);
          return;
        }
        history.goBack();
      });
    });
  };
  const WithCheckbox = row => (
    <Grid
      item
      key={row.studentID}
      xs={4}
    >
      <Page>
        <Box
          display="flex"
        >
          <Box
            alignSelf="center"
            flexGrow={1}
          >
            {row.studentID}: {row.studentNameDup}
          </Box>
          <Box>
            <Checkbox
              {...handlar.useHandlarCheckbox(row.studentID)}
            />
          </Box>
        </Box>
      </Page>
    </Grid>
  )
  return (
    <>
      <Box>
        <Typography
          variant="subtitle1"
        >
          기존 학생 추가하기
        </Typography>
      </Box>
      <Grid
        container
        spacing={2}
      >
        {location.state?.status === 200 && location.state?.data.rows.map(WithCheckbox)}
      </Grid>
      <Box
        mt={2}
      >
        <Button
          color="primary"
          onClick={handleSubmit}
          variant="contained"
        >
          추가
        </Button>
      </Box>
    </>
  );
}
let handlar = null;
export default function({
  op
}) {
  // react-router-dom 기반 fetch to state
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const callback = getHandlar(history.replace);
  const [ page, setPage ] = React.useState(location.state?.previous?.page ?? 0);
  const handleClick = (page = 0) => {
    history.replace({
      state: null
    });
    setPage(page);
    fetchIndependentStudents(page, 15, callback);
  };
  const handlar = React.useMemo(() => {
    return FormHandlar();
  }, []);
  React.useLayoutEffect(() => {
    //handlar = FormHandlar();
    fetchIndependentStudents(0, 15, callback);
  }, []);
  if(location?.state?.status !== 200) {
    return null;
  }
  return (
    <>
      <List
        handlar={handlar}
        op={op}
      />
      <DependencyPaginationButtons
        page={page}
        pageSize={location?.state?.data?.totalPage}
        handleClick={handleClick}
      />
      <StudentAdd op={op} />
    </>
  );
};


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
