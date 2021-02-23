import React from 'react';
import * as ReactRouter from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
function makeIter() {
  let j = 2020;
  let i = 0;
  const iter = [];
  for(i; j<2041; j++) {
    iter[i++] = j;
  }
  return iter;
}
let render = 0;
let dom = null;
export default ({
  studentID,
  lessonMonth,
  name
}) => {
  const history = ReactRouter.useHistory();
  const location = ReactRouter.useLocation();
  const year = location.state?.sm?.year// ?? today.getFullYear();
  const month = location.state?.sm?.month// ?? today.getMonth();
  const handleChangeYear = e => handleChange(e.target.value, month);
  const handleChangeMonth = e => handleChange(year, e.target.value);
  const handleChange = (year, month) => {
    history.push({
      state: {
        ...location.state,
        sm: {
          year, month
        }
      }
    });
  }
  return (
    <Box display="flex">
      렌더리욋수{++render}
      객체({JSON.stringify(location.state)})
      <Box>
        <TextField
          size="small"
          variant="outlined"
          select
          type="number"
          label="연도선택"
          value={year}
          onChange={handleChangeYear}
        >
          {makeIter().map(year => 
            <MenuItem value={year}>{year}년</MenuItem>
          )}
        </TextField>
      </Box>
      <Box
        alignSelf="end"
        ml={1}
      >
        <TextField
          size="small"
          variant="outlined"
          select
          label="월선택"
          value={month}
          onChange={handleChangeMonth}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => 
            <MenuItem value={month}>{month}월</MenuItem>
          )}
        </TextField>
      </Box>
    </Box>
  );
}
