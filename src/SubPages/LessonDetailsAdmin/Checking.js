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
import CloseIcon from '@material-ui/icons/Close';
import Page from '../../Templates/Page';
import RefundReason from './RefundReason';
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  billingRefundReason,
  billingRefundPrice,
  studySizeIter,
  Checkbox
}) => {
  return (
  <TableRow key={studentID}>
    <TableCell
      padding="checkbox"
      size="small"
      style={{ minWidth: '4rem'}}
    >
      {Checkbox}
    </TableCell>
    <TableCell
      padding="checkbox"
      size="small"
      style={{ minWidth: '10rem'}}
    >
      {studentName}
    </TableCell>
    <TableCell
      padding="checkbox"
      size="small"
      style={{ minWidth: '10rem', maxWidth: '15rem'}}
    >
      {(billingScholarshipCode===1 ? '장학' : (billingTaxCode===1 ? `${numberWithCommas(billingPrice)}원(특수)` : (billingRefundPrice===null || billingRefundPrice===undefined ? `${numberWithCommas(billingPrice)}원` : `${numberWithCommas(billingPrice)}원(-${billingRefundPrice}원)`)))}
    </TableCell>
    {checkOks ?
      studySizeIter.map((val, key) =>
      <TableCell
        key={key}
        padding="checkbox"
        size="small"
      >
        <Icon color={typeof checkOks[`${key+1}`] === 'number' && checkOks[key]===1 ? 'secondary' : 'disabled'}>
          {typeof checkOks[`${key+1}`] === 'number' ?
            <CheckIcon /> :
            <CloseIcon />
          }
        </Icon>
      </TableCell>
    ) :
      null
    }
  </TableRow>
  );
};

export default ({
  studySize,
  students
}) => {
  const location = useLocation();
  const history = useHistory();
  const { quarterID, lessonMonth } = useParams();
  const Reason = obj => ({
    ...obj,
    Checkbox: (<RefundReason key={obj.studentID} refundReason={obj.billingRefundReason} />)
  });
  const studySizeIter = iter(studySize);
  return (
  <>
    <Typography variant="subtitle1">
      출결표
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
                padding="checkbox"
                size="small"
              >
                환불
              </TableCell>
              <TableCell
                padding="checkbox"
                size="small"
              >
                학생 이름
              </TableCell>
              <TableCell
                padding="checkbox"
                size="small"
              >
                수업료
              </TableCell>
              {studySizeIter.map((a, i) =>
                <TableCell
                  key={i}
                  padding="checkbox"
                  size="small"
                >
                  {i+1}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {students && students.map(obj => ({ ...obj, studySizeIter })).map(Reason).map(Row)}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  </>
  );
}
