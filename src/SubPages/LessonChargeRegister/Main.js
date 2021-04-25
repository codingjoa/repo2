import React from 'react';
import * as ReactRouter from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Page from '../../Templates/Page';
import SelectingTeacher from './SelectingTeacher';
import Submit from './Submit';
import GoBack from './GoBack';
export default function() {
  const location = ReactRouter.useLocation();
  const [ pickedTeacher, setPickedTeacher ] = React.useState(location.state?.data.teacherID ?? null);
  return (
    <>
      <Typography variant="subtitle1">
        지도강사 변경
      </Typography>
      <Page>
        <Box
          mb={2}
        >
          <Typography
            variant="subtitle2"
          >
            팀 이름
          </Typography>
          <Typography
            variant="h6"
            color="primary"
          >
            {location.state?.data.quarterName}
          </Typography>
        </Box>
        <Box
          mb={2}
        >
          <Typography
            variant="subtitle2"
          >
            지도강사
          </Typography>
          <SelectingTeacher
            pickedTeacher={pickedTeacher}
            setPickedTeacher={setPickedTeacher}
          />
        </Box>
        <Box
          display="flex"
        >
          <Box
            mr={1}
          >
            <Submit
              pickedTeacher={pickedTeacher}
            />
          </Box>
          <Box>
            <GoBack />
          </Box>
        </Box>
      </Page>
    </>
  );

}
