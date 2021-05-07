import React from 'react';
import * as ReactRouter from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Context } from './Context';
function makeIter() {
  let j = 2020;
  let i = 0;
  const iter = [];
  for(i; j<2041; j++) {
    iter[i++] = j;
  }
  return iter;
}

function multi(...param) {
  const fns = new Set(param);
  return (...args) => {
    fns.forEach(fn => fn(...args));
  };
}

export default () => {
  const history = ReactRouter.useHistory();
  const { year, month, emonth, summit } = React.useContext(Context);
  const initialValue = (localStorage.getItem('salary') ?? 1800000)-0;
  const [ salary, setSalary ] = React.useState(initialValue);
  const handlar = (year, month) => {
    history.push({
      state: {
        year,
        month
      }
    });
  }
  const saveStorage = e => {
    // 기본급 조정후 로컬스토리지에 저장
    localStorage.setItem('salary', salary);
  };
  const onClick = multi(
    saveStorage,
    e => summit(salary)
  );
  const handleChangeYear = e => history.push({
    state: {
      year: e.target.value,
      month,
      emonth
    }
  });
  const handleChangeMonth = e => history.push({
    state: {
      year,
      month: e.target.value,
      emonth
    }
  });
  const handleChangeEndMonth = e => history.push({
    state: {
      year,
      month,
      emonth: e.target.value
    }
  });
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
          value={year}
          disabled
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
    </Box>
    <Box
      display="flex"
      mt={1}
    >
      <Box>
        <TextField
          size="small"
          type="number"
          variant="outlined"
          value={salary}
          label="기본급 입력"
          onChange={e => {
            if(/^0\d{1,}/.test(e.target.value)) setSalary(/^0(\d{1,})/.exec(e.target.value)[1]);
            else if(/^\d/.test(e.target.value)) setSalary(e.target.value - 0);
            else setSalary(0);
          }}
        />
      </Box>
      <Box alignSelf="center">
        <Button
          color="primary"
          variant="contained"
          onClick={onClick}
        >
          정산
        </Button>
      </Box>
    </Box>
  </>
  );
}
