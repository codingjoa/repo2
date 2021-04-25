import React from 'react';
import * as ReactRouter from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default ({
  disabled,
  lessonMonth,
  quarterID,
  quarterName
}) => {
  const question = () => {
    const userAnswer = window.confirm(`${quarterName} 팀의 수업을 마감합니다.`);
    if(!userAnswer) {
      return;
    }
    alert('doNothing');
  };
  return (
    <Button
      variant="contained"
      color="secondary"
      disabled={disabled}
      onClick={question}
    >
      출석부 마감
    </Button>
  );
}
