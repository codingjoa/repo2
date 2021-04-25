import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import { getHandlar } from '../../Templates/Format';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormHandlar from '../../Templates/FormHandlar';
import Page from '../../Templates/Page';
import Refund from './Refund';
import Register from './Register';
function lessonMonthToString(
  lessonMonth
) {
  if(typeof lessonMonth !== 'string') {
    return '';
  }
  const lm = new Date(lessonMonth);
  return `${lm.getFullYear()}년 ${lm.getMonth()+1}월`;
}
function parseLessonMonth(
  lessonMonth
) {
  if(typeof lessonMonth !== 'string') {
    return {
      year: null,
      month: null
    };
  }
  const arr = /^(\d{4})-(\d{2})-\d{2}/.exec(lessonMonth);
  return {
    year: arr[1] - 0,
    month: arr[2] - 0
  };
}
function fetchBilling(
  studentID,
  lessonMonth,
  callback
) {
  axios.get(`/api/admin/billing/${studentID}/${lessonMonth}`)
  .then(
    result => callback(null, result),
    callback
  );
}
function editBilling(
  studentID,
  lessonMonth,
  body,
  callback
) {
  axios.put(`/api/admin/billing/${studentID}/${lessonMonth}`, body)
  .then(
    result => callback(null, result),
    callback
  );
}
function PutButton({
  billingRefundEditable,
  studentName,
  getValues
}) {
  const {
    studentID,
    lessonMonth
  } = ReactRouter.useParams();
  const handleSubmit = () => {
    const userAnswer = window.confirm(`${studentName} 학생의 입금 내역을 변경합니다.`);
    if(!userAnswer) {
      return;
    }
    getValues(values => {
      const {
        billingPrice,
        billingGroup,
        billingPayment,
        billingTaxCode,
        billingScholarshipCode,
        billingRefundRegCode,
        billingRefundPrice,
        billingRefundReason
      } = values;
      const lastBody = {
        billingPrice,
        billingGroup,
        billingPayment,
        billingTaxCode: (billingTaxCode===1 ? 1 : 0),
        billingScholarshipCode: (billingScholarshipCode===1 ? 1 : 0),
        billingRefundPrice: (billingRefundEditable===1 && billingRefundRegCode===1 ? (billingRefundPrice===null ? 0 : billingRefundPrice) : null),
        billingRefundReason: (billingRefundEditable===1 && billingRefundRegCode===1 ? (billingRefundReason===null ? '' : billingRefundReason) : null)
      };
      editBilling(studentID, lessonMonth, lastBody, err => {
        if(err) {
          alert(err?.response?.data?.cause ?? err);
          return;
        }
        alert('변경되었습니다.');
        history.push('/admin/lesson', {
          previous: parseLessonMonth(lessonMonth)
        });
      });
    });
  }
  const history = ReactRouter.useHistory();
  return (
    <Box
      m={1}
    >
      <Button
        color="primary"
        fullWidth
        onClick={handleSubmit}
        variant="contained"
      >
        변경
      </Button>
    </Box>
  );
}
function Optional() {
  const location = ReactRouter.useLocation();
  const {
    billingPrice,
    billingGroup,
    billingPayment,
    billingTaxCode,
    billingScholarshipCode,
    billingRefundEditable,
    billingRefundPrice,
    billingRefundReason
  } = location.state?.data ?? {};
  const {
    values,
    getValues,
    useHandlar,
    useHandlarCheckbox
  } = FormHandlar(
    () => 0,{
      billingPrice,
      billingGroup,
      billingPayment,
      billingTaxCode,
      billingScholarshipCode,
      billingRefundPrice,
      billingRefundReason,
      billingRefundRegCode: (billingRefundPrice===null) ? 0 : 1
    }
  );
  const billingScholarshipCodeTag = useHandlarCheckbox('billingScholarshipCode');
  return (
    <>
      <Register
        billingScholarshipCodeTag={billingScholarshipCodeTag}
        useHandlar={useHandlar}
        useHandlarCheckbox={useHandlarCheckbox}
        values={values}
      />
      {billingRefundEditable===1 && <Refund
        billingScholarshipCodeTag={billingScholarshipCodeTag}
        useHandlar={useHandlar}
        useHandlarCheckbox={useHandlarCheckbox}
        values={values}
      />}
      {billingRefundEditable===0 &&
        <Typography
          variant="caption"
        >
          마감되지 않은 수업은 환불 등록을 할 수 없습니다.
        </Typography>
      }
      <PutButton
        billingRefundEditable={billingRefundEditable}
        studentName={location.state?.data?.studentName}
        getValues={getValues}
      />
    </>
  );
}

export default function() {
  const history = ReactRouter.useHistory();
  const location = ReactRouter.useLocation();
  const {
    studentID,
    lessonMonth
  } = ReactRouter.useParams();
  const callback = getHandlar(history.replace);
  React.useLayoutEffect(() => {
    fetchBilling(
      studentID,
      lessonMonth,
      callback
    );
  }, []);
  return (
    <Page>
      <Box display="flex">
        <Box
          flexGrow={1}
          alignSelf="center"
        >
          <Typography
            color="primary"
            variant="h6"
          >
            {location.state?.data?.studentName} 학생 입금 내역 수정
          </Typography>
          <Typography
            color="primary"
            variant="caption"
          >
            {location.state?.data?.quarterName} 팀, {lessonMonthToString(location.state?.data?.lessonMonth)} 수업
          </Typography>
        </Box>
      </Box>
      {location.state?.status === 200 && <Optional />}
    </Page>
  );
}
