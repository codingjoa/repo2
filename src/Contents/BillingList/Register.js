import React from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Page from '../../Templates/Page';

export default ({ studentID, studentName, useState, QuarterList }) => {
  const { checkbox, quarter, group, payment, price } = useState(studentID, studentName);
  return (
  <Page>
    <Box display="flex">
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        <Typography variant="subtitle1">
          {studentName}
        </Typography>
      </Box>
      <Box>
        <Tooltip TransitionComponent={Zoom} title="수강 등록">
          <Checkbox {...checkbox} />
        </Tooltip>
      </Box>
    </Box>
    {checkbox.checked && <>
    <Box display="flex">
      <Box
        flexGrow={1}
      >
        <TextField
          select
          label="반"
          size="small"
          variant="outlined"
          {...quarter}
        >
          {QuarterList.map(row => 
            <MenuItem value={row.quarterID}>
              {row.quarterName}
            </MenuItem>
          )}
        </TextField>
      </Box>
      <Box>
        <TextField
          select
          label="그룹 여부"
          size="small"
          variant="outlined"
          {...group}
        >
          <MenuItem value={0}>
            개인 레슨
          </MenuItem>
          <MenuItem value={1}>
            그룹 레슨(2~4인)
          </MenuItem>
          <MenuItem value={2}>
            그룹 레슨(5~6인)
          </MenuItem>
        </TextField>
      </Box>
      <Box>
        <TextField
          select
          label="결제 수단"
          size="small"
          variant="outlined"
          {...payment}
        >
          <MenuItem value={0}>
            현금(계좌이체)
          </MenuItem>
          <MenuItem value={1}>
            카드(신용/체크)
          </MenuItem>
        </TextField>
      </Box>
    </Box>
    <Box>
      <Box>
        <TextField
          size="small"
          label="납입한 수업료"
          type="number"
          variant="outlined"
          {...price}
        />
      </Box>
    </Box>
    </>}
  </Page>
  );
}
