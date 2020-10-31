import React from 'react';
import Box from '@material-ui/core/Box';
import Page from '../../Templates/Page';
import Close from './Close';
import Rename from './Rename';
import PasswordReset from './PasswordReset';

export default ({ list }) => (<>
  {list && list.map(({ teacherName, teacherID, teacherAccount, teacherOp, isCanBeClosed }) => <Page>
    <Box display="flex">
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        {teacherOp ? '[원장]' : null}{teacherName}({teacherAccount}){!isCanBeClosed ? '(수업중)' : null}
      </Box>
      <Box>
        <Rename id={teacherID} name={teacherName} />
      </Box>
      <Box>
        <PasswordReset id={teacherID} name={teacherName} disabled={teacherOp}/>
      </Box>
      <Box>
        <Close id={teacherID} name={teacherName} disabled={teacherOp || !isCanBeClosed}/>
      </Box>
    </Box>
  </Page>)}
</>);
