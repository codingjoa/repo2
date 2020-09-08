
export default function AddStudentForm({ open, setOpen }) {
  const idi = useRef();
  const i = useRef();

  return(
    <div>
      <Dialog open={open ?? false} onClose={() => setOpen && setOpen(false)} >
        <DialogTitle>학생 추가</DialogTitle>
        <DialogContent>
          <TextField label="분기" type="text" name="qid" /><br/>
          <TextField label="이름" type="text" name="userName" /><br/>
          <TextField label="나이" type="text" name="age" /><br/>
          <TextField label="생년월일" type="date" name="birthday" fullWidth /><br/>
<Select label="성별" id="select" value="f" fullWidth> <MenuItem value="f">여</MenuItem> <MenuItem value="m">남</MenuItem> </Select><br/>
          <TextField label="성별" type="text" name="gender" /><br/>
          <TextField label="핸드폰번호" type="text" name="phone" /><br/>
          <TextField label="이메일" type="text" name="email" /><br/>
          <TextField label="주소" type="text" name="address" /><br/>
          <TextField label="특이사항" type="text" name="uniqueness" /><br/>
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
