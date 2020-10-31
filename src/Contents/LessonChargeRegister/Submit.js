import React, {
  useContext,
  useCallback
} from 'react';
import {
  useParams,
  useHistory
} from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { Context } from './Context';

export default () => {
  const { pickedTeacher } = useContext(Context);
  const { quarterID } = useParams();
  const history = useHistory();
  const handleSubmit = useCallback(() => {
    axios.post(`/api/admin/lesson/${quarterID}/${pickedTeacher}`)
    .then(() => {
      history.push('/admin/lesson');
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`적용 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, [ pickedTeacher ]);
  return (
    <Button disabled={typeof pickedTeacher !== 'number'} onClick={handleSubmit} color="primary">
      배치 완료
    </Button>
  );
}
