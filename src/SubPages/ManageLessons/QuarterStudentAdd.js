import React from 'react';
import * as ReactRouter from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default ({
  lessonEnded,
  quarterID
}) => {
  const history = ReactRouter.useHistory();
  const handleClick = () => {
    history.push(`/admin/quarter/${quarterID}/student`);
  };
  if(lessonEnded === 1) {
    return null;
  }
  return (
    <Chip
      clickable
      icon={<AddCircleIcon />}
      onClick={handleClick}
      size="small"
    />
  );
};
