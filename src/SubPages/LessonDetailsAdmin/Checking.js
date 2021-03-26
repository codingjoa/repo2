import React from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

import CheckIcon from '@material-ui/icons/Check';
import Page from '../../Templates/Page';
import RefundCheckbox from './RefundCheckbox';
import RefundReason from './RefundReason';
import Handlar from './Handlar';
function alerter(iter) {
  alert(JSON.stringify( iter ));
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function toYear(origin) {
  return (new Date(origin)).getFullYear();
}
function iter(size) {
  const arr = [];
  for(let i=0; i<size; i++)
    arr[i] = undefined;
  return arr;
}
const Row = ({
  studentID,
  studentName,
  studentBirthday,
  billingPrice,
  billingScholarshipCode,
  billingTaxCode,
  checkOks,
  refundReason,
  refundPercent,
  Checkbox
}) => {
  return (
  <TableRow>
    <TableCell
      padding="small"
      size="small"
    >
      {Checkbox}
    </TableCell>
    <TableCell
      padding="small"
      size="small"
      style={{ minWidth: '10rem'}}
    >
      {studentName}{studentBirthday && `(${toYear(studentBirthday)}년)`}
    </TableCell>
    <TableCell
      padding="small"
      size="small"
      style={{ minWidth: '10rem'}}
    >
      {(billingScholarshipCode===1 ? '장학' : (billingTaxCode===1 ? `${numberWithCommas(billingPrice)}원(특수)` : (refundPercent===null || refundPercent===undefined ? `${numberWithCommas(billingPrice)}원` : `${numberWithCommas(billingPrice)}원(${refundPercent}% 환불)`)))}
    </TableCell>
    {checkOks ? Object.entries(checkOks).map(([ key, val ]) =>
      <TableCell
        padding="small"
        size="small"
      >
        <Icon color={val ? 'secondary' : 'disabled'}><CheckIcon /></Icon>
      </TableCell>
    ) : null}
  </TableRow>
  );
};

export default ({
  studySize,
  students
}) => {
  const { useHandlar, getTargets } = Handlar(students ?? []);
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
  const CheckBox = obj => ({
    ...obj,
    Checkbox: (<RefundCheckbox {...useHandlar(obj.studentID)} />)
  });
  const Reason = obj => ({
    ...obj,
    Checkbox: (<RefundReason refundReason={obj.refundReason} />)
  });
  return (
  <>
    <Typography variant="subtitle1">
      {location?.state?.isCanBeClosed ?
        <>환불/이월할 학생 선택</> :
        <>출결표</>
      }
    </Typography>
    <Page>
      <TableContainer
        component={Paper}
        style={{ minHeight: '20rem' }}
      >
        <Table
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell
                padding="small"
                size="small"
              >
                환불
              </TableCell>
              <TableCell
                padding="small"
                size="small"
              >
                학생 이름
              </TableCell>
              <TableCell
                padding="small"
                size="small"
              >
                수업료
              </TableCell>
              {iter(studySize).map((a, i) =>
                <TableCell
                  padding="small"
                  size="small"
                >
                  {i+1}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {students && students.map(location.state?.isCanBeClosed ? CheckBox : Reason).map(Row)}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
    {location?.state?.isCanBeClosed &&
    <Grid item xs={12}>
      <Box display="flex" flexDirection="row">
        <Box>
          <Button
            color="secondary"
            variant="contained"
            onClick={e => getTargets(goNext)}
          >
            출석/환불 마감하기
          </Button>
        </Box>
      </Box>
    </Grid>
    }
  </>
  );
}
