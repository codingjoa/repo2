import React from 'react';
import Typography from '@material-ui/core/Typography';
import General from './TextField';

export default function Main({initialDate}) {
  return (
    <>
      <Typography variant="subtitle1">새로운 학생 추가</Typography>
      <General
        name=""
        birthday=""
        gender=""
        phone=""
        email=""
        address=""
      />
    </>
  );
}
