import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default ({ quarterID, quarterName }) => (
  <Button
    component={Link}
    variant="contained"
    color="primary"
    to={{
      pathname: `/admin/lessonCharge/add/${quarterID}`,
      state: {
        quarterName
      }
    }}
  >
    선생 배치
  </Button>
)
