import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default ({ quarterID, lessonMonth, disabled}) => (
  <Button
    variant="contained"
    color="primary"
    disabled={disabled}
    component={Link}
    to={`/admin/lesson/detail/${quarterID}/${lessonMonth}`}
  >
    상세보기
  </Button>
)
