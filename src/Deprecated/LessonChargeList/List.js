import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
import Register from './Register';

export default ({ list }) => (<>
  {list && list.map(({ quarterID, quarterName, singleStudent, groupStudent}) => <Page>
    <Box display="flex">
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        <Typography variant="subtitle1">
          {quarterName}(개인 {singleStudent}명 / 그룹 {groupStudent}명)
        </Typography>
      </Box>
      <Box>
        <Register quarterID={quarterID} quarterName={quarterName} />
      </Box>
    </Box>
  </Page>)}
</>);
