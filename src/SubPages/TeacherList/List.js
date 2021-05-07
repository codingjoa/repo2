import React from 'react';
import Box from '@material-ui/core/Box';
import Page from '../../Templates/Page';
import Close from './Close';
import Rename from './Rename';
import PasswordReset from './PasswordReset';

export default ({
  list
}) => (<>
  {list && list.map(({
    teacherName, teacherID, teacherAccount,
    teacherOp, isForeigner, isCanBeClosed
  }) => <Page key={teacherID}>
    <Box display="flex">
      <Box>
        사번: {teacherID}
      </Box>
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        {teacherOp ? '[원장급]' : null}{teacherName}({isForeigner===1 ? `외/` : null}{teacherAccount}){!isCanBeClosed ? '(수업중)' : null}
      </Box>
      <Box>
        <Rename
          id={teacherID}
          name={teacherName}
        />
      </Box>
      <Box>
        <PasswordReset
          id={teacherID}
          name={teacherName}
          disabled={teacherName === 'admin'}
        />
      </Box>
      <Box>
        <Close
          id={teacherID}
          name={teacherName}
          disabled={teacherName === 'admin' || !isCanBeClosed}
        />
      </Box>
    </Box>
  </Page>)}
</>);
