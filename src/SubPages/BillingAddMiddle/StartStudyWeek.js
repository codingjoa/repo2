import React from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
function makeIter(
  studySize
) {
  let j = 1;
  let i = 0;
  const iter = [];
  for(i; j<=studySize; j++) {
    iter[i++] = j;
  }
  return iter;
}
export default function({
  useHandlar,
  studySize
}) {
  return (
    <Box
      m={1}
    >
      <TextField
        select
        fullWidth
        variant="outlined"
        size="small"
        label="수업 시작 횟수"
        {...useHandlar('startStudyWeek')}
      >
        {makeIter(studySize).map(size =>
          <MenuItem
            key={size}
            value={size}
          >
            {size}회 부터
          </MenuItem>
        )}
      </TextField>
    </Box>
  );
};
