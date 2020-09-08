import React, { useState, useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';

export default function TeacherDelete({ tid, refresh }) {
  // 경고창 띄우기용 state
  const [ open, setOpen ] = useState(false);

  // sid를 부모로부터 받아서 그 sid를 삭제
  const Delete = useCallback(() => {
    // refresh는 Customer를 다시 불러오는 역할임
    axios.delete(`/api/db/teacher/${tid}`).then(refresh);
  }, [ tid, refresh ]);

  // 컴포넌트 뿌리기
  return (
    <div>
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
          <Button variant="contained" color="primary" onClick={Delete}>삭제</Button>
          <Button variant="contained" color="primary" onClick={() => setOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
