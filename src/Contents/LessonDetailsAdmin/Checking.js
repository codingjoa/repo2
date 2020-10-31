import React from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import Page from '../../Templates/Page';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CheckIcon from '@material-ui/icons/Check';
import RefundCheckbox from './RefundCheckbox';
import Handlar from './Handlar';
function alerter(iter) {
  alert(JSON.stringify( iter ));
}
function isDisabled(week1, week2, week3, week4) {
  return !(!week2 && !week3 && !week4);
}

export default ({ checking }) => {
  const { useHandlar, getTargets } = Handlar(checking);
  const location = useLocation();
  const history = useHistory();
  const { quarterID, lessonMonth } = useParams();
  const goNext = refundBilling => {
    if(refundBilling.length !== 0)
    history.push({
      pathname: '/admin/lessonEnd/refundReason',
      state: {
        quarterID,
        lessonMonth,
        refundBilling
      }
    });
    else
      history.push({
        pathname: '/admin/lessonEnd/review',
        state: {
          quarterID,
          lessonMonth,
          p: null
        }
      });
  };
  return (
  <>
    <Typography variant="subtitle1">
      출결표
    </Typography>
    <Page>
      {checking && checking.map(({ studentID, studentName, week1, week2, week3, week4, refundReason }) =>
      <>
        <Box display="flex">
          <Box flexGrow={1} alignSelf="center">{studentName}</Box>
          <Box alignSelf="center"><Icon color={week1 ? 'secondary' : 'disabled'}><CheckIcon /></Icon></Box>
          <Box alignSelf="center"><Icon color={week2 ? 'secondary' : 'disabled'}><CheckIcon /></Icon></Box>
          <Box alignSelf="center"><Icon color={week3 ? 'secondary' : 'disabled'}><CheckIcon /></Icon></Box>
          <Box alignSelf="center"><Icon color={week4 ? 'secondary' : 'disabled'}><CheckIcon /></Icon></Box>
          {location?.state?.isCanBeClosed && <RefundCheckbox disabled={isDisabled(week1, week2, week3, week4)} {...useHandlar(studentID)}/>}
        </Box>
        <>
        {refundReason ?
        <>
          <Divider />
          <Box>
            <Typography variant="caption">
              "{refundReason}" 사유로 환불/이월로 기록했습니다.
            </Typography>
          </Box>
        </>
        : null}
        </>
      </>
      )}
    </Page>
    {location?.state?.isCanBeClosed &&
    <Grid item xs={12}>
      <Box display="flex" flexDirection="row-reverse">
        <Box>
          <Button onClick={e => getTargets(goNext)}>실행</Button>
        </Box>
      </Box>
    </Grid>
    }
  </>
  );
}
