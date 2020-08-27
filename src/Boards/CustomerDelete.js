import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';

export default function CustomerDelete({ sid, Remover }) {
  const [ open, setOpen ] = useState(false);
  checkCustomer(sid){
      const url = '/:sid';
      fetch(url, {
          method:'POST'
      });
      this.props.stateRefresh();
  }
  return (
    <div>
      <Button variant="contained" color="secondary" onClick={(e)=>{this.checkCustomer(this.props.sid)}}>출석</Button>
      <Button variant="contained" color="secondary" onClick={()=> setOpen(true)}>삭제</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle onClose={() => setOpen(false)}>
          삭제 경고
        </DialogTitle>
        <DialogContent gutterBottom>
          <Typography>
            선택한 고객 정보가 삭제됩니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => Remover(sid)}>삭제</Button>
          <Button variant="contained" color="primary" onClick={() => setOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
