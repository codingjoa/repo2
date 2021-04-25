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
//const years = makeIter();
/*
function Menus({
  options
}) {
  const [ anchorEl, setAnchorEl ] = React.useState(null);
  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted,

    >

    </Menu
  );
}
*/

export const useSelector = (
  defaultValue
) => {
  const DO = new Date();
  const [ year, setYear ] = React.useState(defaultValue?.year ?? DO.getFullYear());
  const [ month, setMonth ] = React.useState(defaultValue?.month ?? DO.getMonth()+1);
  // 2번의 렌더링
  const YearSelector = ({
    submitButton = null
  }) => (
    // 1번의 렌더링
    <>
      <Box display="flex">
        <Box>
          <TextField
            label="연도"
            onChange={e => setYear(e.target.value)}
            size="small"
            select
            type="number"
            value={year}
            variant="outlined"
          >
            {makeIter().map(year =>
              <MenuItem
                key={year}
                value={year}
              >
                {year}년
              </MenuItem>
            )}
          </TextField>
        </Box>
        <Box
          alignSelf="end"
          ml={1}
        >
          <TextField
            label="월"
            onChange={e => setMonth(e.target.value)}
            size="small"
            select
            value={month}
            variant="outlined"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month =>
              <MenuItem
                key={month}
                value={month}
              >
                {month}월
              </MenuItem>
            )}
          </TextField>
        </Box>
        {submitButton && (
          <Box
            alignSelf="center"
            ml={1}
          >
            {submitButton}
          </Box>
        )}
      </Box>
    </>
  );
  return {
    year, month, YearSelector
  };
};
