import React, { useContext, useState, useLayoutEffect } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Context } from './Context';

export default () => {
  const { pickedTeacher, setPickedTeacher } = useContext(Context);
  const [ fd, setFd ] = useState(null);
  const handleChange = e => {
    setPickedTeacher(e.target.value);
  };
  useLayoutEffect(() => {
    axios.get(`/api/admin/teacher`)
    .then(r => setFd(r.data.fetchedData))
    .catch(e => {
      e.request && setFd(1);
      e.response && setFd(e.response.status);
    });
  }, []);
  if(!fd) return (<></>);
  return (
    <Box
      mt={1}
    >
      <TextField
        select
        fullWidth
        variant="outlined"
        size="small"
        label="담당할 선생님"
        value={pickedTeacher}
        onChange={handleChange}
      >
        {typeof fd === 'object' && fd.map(({ teacherID, teacherName}) => 
          <MenuItem value={teacherID}>{teacherName}</MenuItem>
        )}
      </TextField>
    </Box>
  );
}
