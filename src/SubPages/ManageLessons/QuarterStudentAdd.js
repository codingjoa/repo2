import React from 'react';
import * as ReactRouter from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default ({
  disabled,
  quarterID
}) => {
  const history = ReactRouter.useHistory();
  if(disabled) {
    return null;
  }
  return (
    <Chip
      clickable
      icon={<AddCircleIcon />}
      onClick={() => history.push(`/test/0417/${quarterID}`)}
      size="small"
    />
  );
};
