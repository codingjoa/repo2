import React, { useContext } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Page from '../../Templates/Page';
import { Context } from './Context';

function Create(reload) {
  const r = window.confirm('새 반을 만들까요?');
  if(!r) return;
  axios.post('/api/admin/quarter')
  .then(r => {
    reload();
  })
  .catch(e => {
    if(e.response?.status===400 && !alert(`생성 실패: ${e.response.data.cause}`)) return;
    alert(e);
  });
}

export default () => {
  const { reload } = useContext(Context);
  return (<Page>
  <Box display="flex" flexDirection="row-reverse" flexWrap="noWrap">
    <Box><Button color="secondary" variant="contained" onClick={e => Create(reload)}>
      <Tooltip TransitionComponent={Zoom} title="추가">
        <AddIcon />
      </Tooltip>
    </Button></Box>
  </Box>
  </Page>);
}
