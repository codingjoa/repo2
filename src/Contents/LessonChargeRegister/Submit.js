import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { Context } from './Context';

export default () => {
  const { pickedTeacher, pickedSize } = React.useContext(Context);
  const { quarterID } = ReactRouter.useParams();
  const history = ReactRouter.useHistory();
  const handleSubmit = React.useCallback(() => {
    axios.post(`/api/admin/lesson/${quarterID}/${pickedTeacher}/${pickedSize}`)
    .then(() => {
      history.push('/admin/lesson');
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`적용 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, [ pickedTeacher, pickedSize ]);
  return (
    <Button
      disabled={typeof pickedTeacher !== 'number'}
      onClick={handleSubmit}
      color="secondary"
      variant="contained"
    >
      배치 완료
    </Button>
  );
}
