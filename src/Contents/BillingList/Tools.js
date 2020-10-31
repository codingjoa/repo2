import React from 'react';
//import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Page from '../../Templates/Page';
import SelectingMonth from './SelectingMonth';

export default ({ handleSubmit, disabled }) => (
  <Page>
  <Box display="flex" flexDirection="row-reverse" flexWrap="noWrap">
    <Box><Button disabled={disabled} color="secondary" variant="contained" onClick={handleSubmit}>
      <Tooltip TransitionComponent={Zoom} title="등록">
        <AddIcon />
      </Tooltip>
    </Button></Box>
    <Box flexGrow={1}><SelectingMonth /></Box>
  </Box>
  </Page>
)
/*
export default () => (
  <Page>
  <Box display="flex" flexDirection="row-reverse" flexWrap="noWrap">
    <Box><Button color="secondary" variant="contained" component={Link} to="/admin/billing/add">
      <Tooltip TransitionComponent={Zoom} title="등록">
        <AddIcon />
      </Tooltip>
    </Button></Box>
    <Box flexGrow={1}><SelectingMonth /></Box>
  </Box>
  </Page>
)
*/
