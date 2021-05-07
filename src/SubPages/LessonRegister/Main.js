import React from 'react';
import * as ReactRouter from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Page from '../../Templates/Page';
import SelectStudySize from './SelectStudySize';
import Submit from './Submit';
import GoBack from './GoBack';
const DO = new Date();

export default function() {
  const location = ReactRouter.useLocation();
  const [ pickedSize, setPickedSize ] = React.useState(location?.state?.data?.lastStudySize ?? 4);
  return (
    <>
      <Typography variant="subtitle1">
        수업 등록
      </Typography>
      <Page>
        <Box>
          <Typography
            variant="subtitle2"
          >
            팀 이름
          </Typography>
          <Typography
            variant="h6"
            color="primary"
          >
            {location.state.data.quarterName}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="subtitle2"
          >
            담당 선생님
          </Typography>
          <Typography
            variant="h6"
            color="primary"
          >
            {location.state.data.teacherName}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="subtitle2"
          >
            총 수업 횟수
          </Typography>
          <Typography
            variant="h6"
            color="primary"
          >
            {DO.getFullYear()}년 {DO.getMonth()+1}월
          </Typography>
        </Box>
        <Box>
          <SelectStudySize
            pickedSize={pickedSize}
            setPickedSize={setPickedSize}
          />
        </Box>
      </Page>
      <Box display="flex">
        <Box mr={1}>
          <Submit
            pickedSize={pickedSize}
          />
        </Box>
        <Box>
          <GoBack />
        </Box>
      </Box>
    </>
  );

}
