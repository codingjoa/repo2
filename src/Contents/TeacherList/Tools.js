import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Page from '../../Templates/Page';

export default () => (
  <Page>
  <Box display="flex" flexDirection="row-reverse" flexWrap="noWrap">
    <Box><Button color="secondary" variant="contained" component={Link} to="/admin/teacher/add">
      <Tooltip TransitionComponent={Zoom} title="추가">
        <AddIcon />
      </Tooltip>
    </Button></Box>
  </Box>
  </Page>
)
