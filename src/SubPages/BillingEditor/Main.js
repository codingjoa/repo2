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
function lessonMonthToFormat(
  lessonMonth
) {
  if(typeof lessonMonth !== 'string') {
    return '';
  }
  const lm = new Date(lessonMonth);
  const month = lm.getMonth()+1;
  const day = lm.getDate();
  const len = (`${month}`.length === 1);
  const len1 = (`${day}`.length === 1);
  return `${lm.getFullYear()}-${len ? '0' : ''}${month}-${len1 ? '0' : ''}${day}`;
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
function editBillingMiddle(studentID, lessonMonth, callback) {
  axios.patch(`/api/admin/billing/${studentID}/${lessonMonth}`)
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
        billingUnpaidCode,
        billingRefundRegCode,
        billingRefundPrice,
        billingRefundReason,
        billingRefundAt
      } = values;
      const lastBody = {
        billingPrice,
        billingGroup,
        billingPayment,
        billingTaxCode: (billingTaxCode===true ? 1 : 0),
        billingScholarshipCode: (billingScholarshipCode===true ? 1 : 0),
        billingUnpaidCode,
        billingRefundPrice: (billingRefundEditable===1 && billingRefundRegCode===true ? (billingRefundPrice===null ? 0 : billingRefundPrice) : null),
        billingRefundReason: (billingRefundEditable===1 && billingRefundRegCode===true ? (billingRefundReason===null ? '' : billingRefundReason) : null),
        billingRefundAt: (billingRefundEditable===1 && billingRefundRegCode===true ? (billingRefundAt===null ? lessonMonth : billingRefundAt) : null)
      };
      editBilling(studentID, lessonMonth, lastBody, err => {
        if(err) {
          alert(err?.response?.data?.cause ?? err);
          return;
        }
        alert('변경되었습니다.');
        history.goBack();
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
        onClick={handleSubmit}
        variant="contained"
      >
        변경
      </Button>
    </Box>
  );
}
function BillingMiddle({
  reload
}) {
  const {
    studentID,
    lessonMonth
  } = ReactRouter.useParams();
  const location = ReactRouter.useLocation();
  const handleClick = () => {
    const userAnswer = window.confirm(`${location?.state?.data?.studentName} 학생을 중도 탈퇴합니다. *이후 취소할 수 없습니다.`);
    if(!userAnswer) {
      return;
    }
    editBillingMiddle(studentID, lessonMonth, (err, result) => {
      if(err) {
        alert(err);
        return;
      }
      reload();
    });
  };
  return (
    <Box
      m={1}
    >
      <Button
        color="secondary"
        onClick={handleClick}
        variant="contained"
      >
        중도 탈퇴
      </Button>
    </Box>
  );
}
function Optional({
  reload
}) {
  const { lessonMonth } = ReactRouter.useParams();
  const location = ReactRouter.useLocation();
  const {
    billingPrice,
    billingGroup,
    billingPayment,
    billingTaxCode,
    billingScholarshipCode,
    billingUnpaidCode,
    billingRefundEditable,
    billingRefundPrice,
    billingRefundReason,
    billingRefundAt,
    lessonRegCode
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
      billingTaxCode: (billingTaxCode===1),
      billingScholarshipCode: (billingScholarshipCode===1),
      billingUnpaidCode,
      billingRefundPrice,
      billingRefundReason,
      billingRefundAt: (billingRefundAt!==null) ? lessonMonthToFormat(billingRefundAt) : lessonMonth,
      billingRefundRegCode: (billingRefundPrice===null) ? false : true
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
      <Box
        display="flex"
      >
        <PutButton
          billingRefundEditable={billingRefundEditable}
          studentName={location.state?.data?.studentName}
          getValues={getValues}
        />
        {billingRefundEditable===0 && lessonRegCode===1 && <BillingMiddle
          reload={reload}
        />}
      </Box>
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
      {location.state?.status === 200 && <Optional
        reload={() => {
          history.replace({
            state: null
          });
          fetchBilling(studentID, lessonMonth, callback);
        }}
      />}
    </Page>
  );
}
