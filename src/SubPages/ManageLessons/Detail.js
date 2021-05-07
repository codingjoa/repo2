import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default ({ quarterID, lessonMonth, disabled}) => (
  <Button
    color="primary"
    component={Link}
    disabled={disabled}
    size="small"
    to={`/admin/lesson/detail/${quarterID}/${lessonMonth}`}
    variant="contained"
  >
    상세보기
  </Button>
)
