import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import DeleteIcon from '@material-ui/icons/Delete';
export default ({
  id,
  name,
  disabled,
  handleClick,
  billingRegSize
}) => {
  const location = ReactRouter.useLocation();
  const question = () => {
    const ment = (billingRegSize>0) ? `${name} 학생의 선입금 내역이 ${billingRegSize}회 있습니다. 탈퇴 처리시 같이 삭제됩니다.` : `${name} 학생을 명부에서 삭제합니다.`;
    const userQuestion = window.confirm(ment);
    if(!userQuestion) return;
    axios.delete(`/api/admin/student/${id}`)
    .then(() => {
      handleClick(location?.state?.previous?.page);
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`삭제 실패: ${e?.response?.data?.cause ?? '알 수 없는 오류'}`)) return;
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
