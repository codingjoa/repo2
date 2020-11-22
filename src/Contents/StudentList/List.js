import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Page from '../../Templates/Page';
import Close from './Close';
function toYear(origin) {
  return (new Date(origin)).getFullYear();
}

export default ({ list }) => (<>
  {list && list.map(({ studentName, studentID, studentBirthday, isCanBeClosed }) => <Page>
    <Box display="flex">
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        {studentName}{studentBirthday && `(${toYear(studentBirthday)}년)`}{!isCanBeClosed ? '(수업 예정/진행중)' : null}
      </Box>
      <Box
        alignSelf="center"
      >
        <Button
          variant="contained"
          component={Link}
          to={`/admin/student/detail/${studentID}`}
        >
          상세 보기
        </Button>
      </Box>
      <Box>
        <Close id={studentID} name={studentName} disabled={!isCanBeClosed} />
      </Box>
    </Box>
  </Page>)}
</>);
