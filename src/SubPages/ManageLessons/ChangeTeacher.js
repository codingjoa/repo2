import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default ({
  quarterID, quarterName, disabled,
  teacherID
}) => (
  <Button
    color="primary"
    component={Link}
    disabled={disabled}
    size="small"
    to={{
      pathname: `/admin/lessonCharge/${quarterID}`,
      state: {
        data: {
          quarterName,
          teacherID
        }
      }
    }}
    variant="contained"
  >
    지도강사변경
  </Button>
)
