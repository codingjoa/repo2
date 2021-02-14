import React, { useContext } from 'react';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import EditIcon from '@material-ui/icons/Edit';
import { Context } from './Context';

export default ({ id, name }) => {
  const { reload } = useContext(Context);
  const question = () => {
    const newName = prompt('변경할 이름을 입력', name);
    if(newName === null) return;
    axios.put(`/api/admin/quarter/${id}`, { quarterName: newName })
    .then(() => {
      reload();
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`변경 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  };
  return (
    <IconButton onClick={question} color="secondary">
      <Tooltip TransitionComponent={Zoom} title="이름 변경">
        <EditIcon />
      </Tooltip>
    </IconButton>
  );
}
