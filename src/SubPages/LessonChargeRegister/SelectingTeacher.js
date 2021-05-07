import React from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

export default ({
  pickedTeacher,
  setPickedTeacher
}) => {
  const [ fd, setFd ] = React.useState(null);
  const handleChange = e => {
    setPickedTeacher(e.target.value);
  };
  React.useLayoutEffect(() => {
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
        label="지도강사"
        value={pickedTeacher}
        onChange={handleChange}
      >
        <MenuItem
          value={null}
        >
          미배치
        </MenuItem>
        {typeof fd === 'object' && fd.map(({ teacherID, teacherName }) =>
          <MenuItem
            key={teacherID}
            value={teacherID}
          >
            {teacherName}
          </MenuItem>
        )}
      </TextField>
    </Box>
  );
}
