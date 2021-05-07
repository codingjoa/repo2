import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
function deleteLesson(quarterID, lessonMonth, callback) {
  axios.delete(`/api/admin/lesson/${quarterID}/${lessonMonth}`)
  .then(r => callback(null, r))
  .catch(callback);
}
export default ({
  disabled,
  lessonMonth,
  quarterID,
  quarterName,
  reload
}) => {
  const question = () => {
    const userAnswer = window.confirm(`${quarterName} 팀의 출석부 발행을 철회합니다.`);
    if(!userAnswer) {
      return;
    }
    deleteLesson(quarterID, lessonMonth, (err, result) => {
      if(err) {
        alert(err);
        return;
      }
      reload();
    });
  };
  return (
    <Button
      color="secondary"
      disabled={disabled}
      onClick={question}
      size="small"
      variant="contained"
    >
      철회
    </Button>
  );
}
