import React, { useContext, useState, useLayoutEffect } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Context } from './Context';
function makeIter() {
  let j = 4;
  let i = 0;
  const iter = [];
  for(i; j<32; j++) {
    iter[i++] = j;
  }
  return iter;
}

export default () => {
  const { pickedSize, setPickedSize } = useContext(Context);
  const handleChange = e => {
    setPickedSize(e.target.value);
  };
  return (
    <Box
      mt={1}
    >
      <TextField
        select
        fullWidth
        variant="outlined"
        size="small"
        label="수업 횟수"
        value={pickedSize}
        onChange={handleChange}
      >
        {makeIter().map(size => 
          <MenuItem
            value={size}
          >
            {size}회 수업
          </MenuItem>
        )}
      </TextField>
    </Box>
  );
}
