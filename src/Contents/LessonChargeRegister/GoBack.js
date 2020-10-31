import React from 'react';
import {
  useHistory
} from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default () => {
  const history = useHistory();
  return (
    <Button onClick={e => history.goBack()} color="primary">
      취소
    </Button>
  );
}
