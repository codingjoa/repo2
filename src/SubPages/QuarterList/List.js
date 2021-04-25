import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
import Close from './Close';
import ChangeTeacher from './ChangeTeacher';
import Rename from './Rename';
function QuarterManage({
  quarterID,
  quarterName,
  teacherID,
  isCanBeClosed
}) {
  return (
    <>
      <Typography
        variant="subtitle2"
      >
        팀 관리
      </Typography>
      <Box
        display="flex"
      >
        <Box>
          <Rename
            id={quarterID}
            name={quarterName}
          />
        </Box>
        <Box>
          <Close
            id={quarterID}
            name={quarterName}
            disabled={!isCanBeClosed}
          />
        </Box>
        <Box
          alignSelf="center"
          ml={1}
        >
          <ChangeTeacher
            quarterID={quarterID}
            quarterName={quarterName}
            teacherID={teacherID}
          />
        </Box>
      </Box>
    </>
  );
}

export default ({
  rows
}) => (<>
  {rows && rows.map(({
    isCanBeClosed,
    quarterName,
    quarterID,
    teacherID,
    teacherName
  }) => (
    <Page>
      <Box
        display="flex"
        mb={2}
      >
        <Box
          flexGrow={1}
        >
          <Typography
            variant="subtitle2"
          >
            팀명
          </Typography>
          <Typography
            color="primary"
            variant="h6"
          >
            {quarterName}
          </Typography>
        </Box>
        <Box
          textAlign="right"
        >
          <Typography
            variant="subtitle2"
          >
            지도강사
          </Typography>
          <Typography
            color="primary"
            variant="h6"
          >
            {(teacherName) ?? '없음'}
          </Typography>
        </Box>
      </Box>
      <Box
        mb={2}
      >
        <Typography
          variant="subtitle2"
        >
          팀 상태
        </Typography>
        <Typography
          color="primary"
          variant="caption"
        >
          {!isCanBeClosed ? '수업 예정 또는 진행중' : null}
        </Typography>
      </Box>
      <QuarterManage
        quarterID={quarterID}
        quarterName={quarterName}
        teacherID={teacherID}
        isCanBeClosed={isCanBeClosed}
      />
    </Page>
  ))}
</>);
