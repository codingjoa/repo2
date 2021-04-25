import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
function addLesson(
  quarterID,
  studySize,
  callback
) {
  axios.post(`/api/admin/lesson/${quarterID}`, { studySize })
  .then(result => callback(null, result), callback);
}
export default ({
  pickedSize
}) => {
  const { quarterID } = ReactRouter.useParams();
  const history = ReactRouter.useHistory();
  const callback = (err, result) => {
    if(err) {
      if(err.response?.status===400 && !alert(`적용 실패: ${err.response.data.cause}`)) return;
      alert('알 수 없는 오류!');
      return;
    }
    history.goBack();
  };
  const handleSubmit = () => {
    addLesson(
      quarterID,
      pickedSize,
      callback
    );
  }
  return (
    <Button
      color="secondary"
      onClick={handleSubmit}
      variant="contained"
    >
      배치 완료
    </Button>
  );
}
