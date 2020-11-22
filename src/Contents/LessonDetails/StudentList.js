import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
function toYear(origin) {
  return (new Date(origin)).getFullYear();
}

export default ({ students }) => {
  const { quarterID, lessonMonth } = useParams();
  return (
    <>
      <Typography variant="subtitle1">
        학생 목록
      </Typography>
      {students && students.map(({ studentID, studentName, studentBirthday }) => <Page>
        <Box display="flex">
          <Box
            flexGrow={1}
            alignSelf="center"
          >
            <Typography variant="h6">
              {studentName}{studentBirthday && `(${toYear(studentBirthday)}년)`}
            </Typography>
          </Box>
          <Box>
            <Button
              component={Link}
              to={`/lesson/detail/${quarterID}/${lessonMonth}/student/${studentID}`}
            >
              상세보기
            </Button>
          </Box>
        </Box>
      </Page>)}
    </>
  );
}
