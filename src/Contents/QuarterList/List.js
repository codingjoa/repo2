import React from 'react';
import Box from '@material-ui/core/Box';
import Page from '../../Templates/Page';
import Close from './Close';
import Rename from './Rename';

export default ({ list }) => (<>
  {list && list.map(({ quarterName, quarterID, isCanBeClosed }) => <Page>
    <Box display="flex">
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        {quarterName}{!isCanBeClosed ? '(수업 예정/진행중)' : null}
      </Box>
      <Box>
        <Rename id={quarterID} name={quarterName} />
      </Box>
      <Box>
        <Close id={quarterID} name={quarterName} disabled={!isCanBeClosed} />
      </Box>
    </Box>
  </Page>)}
</>);
