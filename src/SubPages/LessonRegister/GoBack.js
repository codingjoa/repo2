import React from 'react';
import {
  useHistory
} from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default () => {
  const history = useHistory();
  return (
    <Button
      color="primary"
      onClick={e => history.goBack()}
      variant="contained"
    >
      취소
    </Button>
  );
}
