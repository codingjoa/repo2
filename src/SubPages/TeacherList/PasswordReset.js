import React from 'react';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import LockOpenIcon from '@material-ui/icons/LockOpen';

export default ({ id, name, disabled }) => {
  const question = () => {
    const r = window.confirm(`${name} 선생님의 비밀번호를 초기화합니다.`);
    if(!r) return;
    axios.patch(`/api/admin/teacher/${id}`)
    .then(r => {
      alert(`초기화 성공. 임시 비밀번호는 ${r.data?.createdData?.password}`);
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`변경 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  };
  return (
    <IconButton onClick={question} color="secondary" disabled={disabled}>
      <Tooltip TransitionComponent={Zoom} title="비밀번호 초기화">
        <LockOpenIcon />
      </Tooltip>
    </IconButton>
  );
}
