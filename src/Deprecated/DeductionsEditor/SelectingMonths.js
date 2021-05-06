import React from 'react';
import * as ReactRouter from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
const todayYear = new Date().getFullYear();
function makeIter() {
  let j = 2020;
  let i = 0;
  const iter = [];
  for(i; j<2041; j++) {
    iter[i++] = j;
  }
  return iter;
}

export default ({
  fetchFromTo
}) => {
  const [ year, setYear ] = React.useState(todayYear);
  const [ month, setMonth ] = React.useState(1);
  const [ eyear, setEYear ] = React.useState(todayYear);
  const [ emonth, setEMonth ] = React.useState(12);
  const history = ReactRouter.useHistory();
  const handleChangeYear = e => {
    const newValue = e.target.value - 0;
    if(newValue > eyear) {
      setEYear(newValue - 0);
    }
    setYear(newValue - 0);
  }
  const handleChangeMonth = e => {
    const newValue = e.target.value - 0;
    if(year >= eyear && newValue > eyear) {
      setEMonth(newValue - 0);
    }
    setMonth(newValue - 0);
  }
  const handleChangeEndYear = e => {
    const newValue = e.target.value - 0;
    if(newValue < year) {
      alert('선택한 연도는 시작 연도보다 낮습니다.');
      return;
    }
    setEYear(newValue - 0);
  }
  const handleChangeEndMonth = e => {
    const newValue = e.target.value - 0;
    if(year >= eyear && newValue < month) {
      alert('선택한 달은 시작 달보다 낮습니다.');
      return;
    }
    setEMonth(newValue - 0);
  }
  return (
  <>
    <Box
      display="flex"
      alignItems="center"
    >
      <Box>
        <TextField
          size="small"
          variant="outlined"
          select type="number"
          label="연도"
          value={year}
          onChange={handleChangeYear}
        >
          {makeIter().map(year =>
            <MenuItem value={year}>{year}년</MenuItem>
          )}
        </TextField>
      </Box>
      <Box
        ml={1}
      >
        <TextField
          size="small"
          variant="outlined"
          select
          label="월"
          value={month}
          onChange={handleChangeMonth}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month =>
            <MenuItem value={month}>{month}월</MenuItem>
          )}
        </TextField>
      </Box>
      <Box
        ml={1}
      >
        <Typography
          display="inline"
          variant="body1"
        >
          부터
        </Typography>
      </Box>
    </Box>
    <Box
      display="flex"
      alignItems="center"
      mt={1}
    >
      <Box>
        <TextField
          size="small"
          variant="outlined"
          select type="number"
          label="연도"
          value={eyear}
          onChange={handleChangeEndYear}
        >
          {makeIter().map(year =>
            <MenuItem value={year}>{year}년</MenuItem>
          )}
        </TextField>
      </Box>
      <Box
        ml={1}
      >
        <TextField
          size="small"
          variant="outlined"
          select
          label="월"
          value={emonth}
          onChange={handleChangeEndMonth}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month =>
            <MenuItem value={month}>{month}월</MenuItem>
          )}
        </TextField>
      </Box>
      <Box
        ml={1}
      >
        <Typography
          display="inline"
          variant="body1"
        >
          까지
        </Typography>
      </Box>
      <Box
        alignSelf="center"
        ml={1}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={() => fetchFromTo(year, month, eyear, emonth)}
        >
          정산
        </Button>
      </Box>
    </Box>
  </>
  );
}
