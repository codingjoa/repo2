import React, { useContext } from 'react';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Context } from './Context';

export default ({ studentID, name, disabled }) => {
  const { reload, year, month } = useContext(Context);
  const question = () => {
    const r = window.confirm(`${name} 학생의 ${year}년 ${month}월 입금을 철회합니다.`);
    if(!r) return;
    axios.delete(`/api/admin/billing/${studentID}/${year}-${month}-1`)
    .then(() => {
      reload();
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`철회 실패: ${e.response.data.cause}`)) return;
      if(e.response?.status===403 && !alert(`철회가 불가능합니다.`)) return;
      alert(e);
    });
  };
  return (
    <IconButton onClick={question} color="secondary" disabled={disabled}>
      <CloseIcon />
    </IconButton>
  );
}
