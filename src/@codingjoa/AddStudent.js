import React, { useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function AddStudentForm({ open, setOpen }) {
  const idi = useRef();
  const bdi = useRef();
  const gei = useRef();
  const phi = useRef();
  const emi = useRef();
  const adi = useRef();
  const uni = useRef();

  return(
    <div>
      <Dialog open={open ?? false} onClose={() => setOpen && setOpen(false)} >
        <DialogTitle>학생 추가</DialogTitle>
        <DialogContent>
          <Typography>인적사항</Typography>
          <TextField inputRef={idi} label="이름" type="text" name="userName" style={{ width: '5rem' }} /><br/>
          <TextField inputRef={bdi} label="생년월일" type="date" name="birthday" style={{ width: '10rem' }} /><br/>
          <Select inputRef={gei} label="성별" id="select" value="0" style={{ width: '3rem' }} > <MenuItem value="0">여</MenuItem> <MenuItem value="1">남</MenuItem> </Select><br/>
          <Typography>연락처 정보</Typography>
          <TextField inputRef={phi} label="핸드폰번호" type="text" name="phone" style={{ width: '12rem' }} /><br/>
          <TextField inputRef={emi} label="이메일" type="text" name="email" style={{ width: '20rem' }} /><br/>
          <TextField inputRef={adi} label="주소" type="text" name="address" style={{ width: '40rem' }} /><br/>
          <Typography>기타 정보</Typography>
          <TextField inputRef={uni} label="특이사항" type="text" name="uniqueness" fullWidth /><br/>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" >추가</Button>
          <Button variant="contained" color="primary" onClick={() => setOpen && setOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
      <Button style={{margin:"15px 0"}} variant="contained" color="primary" onClick={() => setOpen && setOpen(false)} >
        출석체크
      </Button>
    </div>
  );
}
