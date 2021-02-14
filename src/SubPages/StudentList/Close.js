
import React, { useContext } from 'react';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import DeleteIcon from '@material-ui/icons/Delete';
import { Context } from './Context';

export default ({ id, name, disabled }) => {
  const { reload } = useContext(Context);
  const question = () => {
    const r = window.confirm(`${name} 학생을 명부에서 삭제합니다.`);
    if(!r) return;
    axios.delete(`/api/admin/student/${id}`)
    .then(() => {
      reload();
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`삭제 실패: ${e.response.data.cause}`)) return;
      if(e.response?.status===403 && !alert(`진행중인 수강신청/수업이 있어서 삭제할 수 없음.`)) return;
      alert(e);
    });
  };
  return (
    <IconButton onClick={question} color="secondary" disabled={disabled}>
      <Tooltip TransitionComponent={Zoom} title="삭제">
        <DeleteIcon />
      </Tooltip>
    </IconButton>
  );
}
