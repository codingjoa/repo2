import React from 'react';
import * as ReactRouter from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
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

export default ({ studentID, lessonMonth, name }) => {
  const { year, month } = React.useContext(Context);
  const history = ReactRouter.useHistory();
  const handleChange = (year, month) => {
    history.push({
      state: {
        year, month
      }
    });
  }
  const handleChangeYear = e => handleChange(e.target.value, month);
  const handleChangeMonth = e => handleChange(year, e.target.value);
  return (
    <Box display="flex">
      <Box>
        <TextField size="small" variant="outlined" select type="number" label="연도" value={year} onChange={handleChangeYear}>
          {makeIter().map(year => 
            <MenuItem value={year}>{year}년</MenuItem>
          )}
        </TextField>
      </Box>
      <Box alignSelf="end">
        <TextField size="small" variant="outlined" select label="월" value={month} onChange={handleChangeMonth}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => 
            <MenuItem value={month}>{month}월</MenuItem>
          )}
        </TextField>
      </Box>
    </Box>
  );
}
