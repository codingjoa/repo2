import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default ({ quarterID, quarterName, lessonMonth, disabled }) => {
  const history = useHistory();
  const question = () => {
    history.push({
      pathname: `/admin/lesson/detail/${quarterID}/${lessonMonth}`,
      state: {
        isCanBeClosed: true
      }
    });
  };
  return (
    <Button
      variant="contained"
      color="secondary"
      disabled={disabled}
      onClick={question}
    >
      마감하기
    </Button>
  );
}

