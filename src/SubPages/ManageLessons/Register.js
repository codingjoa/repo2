import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default ({
  quarterID, quarterName, teacherName,
  students, disabled, lastStudySize
}) => (
  <Button
    color="secondary"
    component={Link}
    disabled={disabled}
    size="small"
    to={{
      pathname: `/admin/lesson/add/${quarterID}`,
      state: {
        data: {
          quarterName,
          teacherName,
          students,
          lastStudySize
        }
      }
    }}
    variant="contained"
  >
    출석부 발행
  </Button>
)
