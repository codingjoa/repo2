import React, { useState, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {withStyles} from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';


const styles = theme => ({
    hidden: {
        display:'none'
    }
});

export default function TeacherAdd() {
  //const {classes} = this.props;
  const [ open, setOpen ] = useState(false);
  const idi = useRef();
  const i = useRef();


  return(
    <div>
      <Button style={{margin:"15px 10px"}} variant="contained" color="primary" onClick={() => setOpen(true)} >
        선생추가
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} >
        <DialogTitle>선생 추가</DialogTitle>
        <DialogContent>
          <TextField label="이름" type="text" name="userName" /><br/>
          <TextField label="계정" type="text" name="age" /><br/>
          <TextField label="비밀번호" type="text" name="gender" /><br/>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" >추가</Button>
          <Button variant="contained" color="primary" onClick={() => setOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
