import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

export default () => (
  <Box>
    <Button color="secondary" variant="contained" component={Link} to="/admin/student/add">
      <Tooltip TransitionComponent={Zoom} title="학생 추가">
        <AddIcon />
      </Tooltip>
    </Button>
  </Box>
);
