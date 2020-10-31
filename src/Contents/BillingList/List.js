import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
import Withdraw from './Withdraw';
function Payment(code) {
  return code === 0 ? '현금' :
  code === 1 ? '카드' :
  '?';
}
function Group(code) {
  return code === 0 ? '개인 레슨' :
  code === 1 ? '그룹 레슨(2~4)' :
  code === 2 ? '그룹 레슨(5~6)' :
  '?';
}

export default ({ studentID, studentName, quarterName, billingPrice, billingPayment, billingGroup, billingRetractable, studentUnused, quarterUnused }) => (
  <Page>
    <Box display="flex">
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        <Typography variant="subtitle1">
          {studentName}{studentUnused ? '(미사용)' : null}/{quarterName}{quarterUnused ? '(미사용)' : null}
        </Typography>
        <Typography variant="subtitle2">
          {Payment(billingPayment)}/{Group(billingGroup)}
        </Typography>
        <Typography variant="h6">
          {billingPrice} 원
        </Typography>
      </Box>
      <Box>
        <Withdraw studentID={studentID} name={studentName} disabled={!billingRetractable}/>
      </Box>
    </Box>
  </Page>
);
