import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import { getHandlar } from '../../Templates/Format';
import FormHandlar from '../../Templates/FormHandlar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
import Month from './Month';
import Register from './Register';
function getRange() {
  const DO = new Date();
  DO.setDate(1);
  let i=0;
  let a = [];
  while(i<12) {
    const year = DO.getFullYear();
    const month = DO.getMonth()+1;
    const len = (`${month}`.length === 1);
    const lessonMonth = `${year}-${len ? '0' : ''}${month}-01`;
    a[i++] = lessonMonth;
    DO.setMonth(month);
  }
  return a;
}
const lessonMonths = getRange();
function fetchBilling(
  studentID,
  callback
) {
  fetchAvailableBillingRange(studentID, (err, availableRange) => {
    if(err instanceof Error) {
      callback(err);
      return;
    }
    const filteredAvailableRange = Object.entries(availableRange?.data?.fetchedData ?? {}).filter(row => row[1]===0).map(row => row[0]);
    if(filteredAvailableRange.length === 0) {
      callback(new Error('1년 분량의 입금이 모두 유효하여 등록할 수 없습니다.'));
    }
    axios.get(`/api/admin/billing/${studentID}/recent`)
    .then(
      result => callback(null, {
        data: {
          fetchedData: {
            availableRange: filteredAvailableRange,
            billing: result.data?.fetchedData
          }
        }
      }),
      callback
    );
  })

}
function fetchAvailableBillingRange(
  studentID,
  callback
) {
  axios.get(`/api/admin/billing/${studentID}/available?${queryString.stringify({ lessonMonth: lessonMonths }, { arrayFormat: 'index' })}`)
  .then(
    result => callback(null, result),
    callback
  );

}
function addBilling(
  studentID,
  lessonMonths,
  billing,
  callback
) {
  const filteredLessonMonths = Object.entries(lessonMonths).filter(row => row[1] === true).map(row => row[0]);
  if(filteredLessonMonths.length === 0) {
    callback(new Error('해당 입금 기간을 선택하세요.'));
    return;
  }
  const {
    billingPrice,
    billingGroup,
    billingPayment,
    billingTaxCode,
    billingScholarshipCode,
    billingUnpaidCode,
  } = billing;
  const body = {
    billingPrice,
    billingGroup,
    billingPayment,
    billingTaxCode: (billingTaxCode===true ? 1 : 0),
    billingScholarshipCode: (billingScholarshipCode===true ? 1 : 0),
    billingUnpaidCode: billingUnpaidCode,
    lessonMonth: filteredLessonMonths
  };
  axios.post(`/api/admin/billing/${studentID}`, body)
  .then(
    result => callback(null, result),
    callback
  );
}
function PostButton({
  studentID,
  studentName,
  billing,
  lessonMonths
}) {
  const history = ReactRouter.useHistory();
  const handleSubmit = () => {
    const userAnswer = window.confirm(`${studentName} 학생의 입금 내역을 변경합니다.`);
    if(!userAnswer) {
      return;
    }
    billing.getValues(billingValues => {
      lessonMonths.getValues(lessonMonthsValues => {
        addBilling(studentID, lessonMonthsValues, billingValues, err => {
          if(err) {
            alert(err?.response?.data?.cause ?? err);
            return;
          }
          alert('등록되었습니다.');
          history.goBack();
        });
      });
    });
  }
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
        등록
      </Button>
    </Box>
  );
}
function Optional() {
  const location = ReactRouter.useLocation();
  const lessonMonth = FormHandlar();
  const billing = FormHandlar(
    () => 0, {
      billingScholarshipCode: location?.state?.data?.billing?.billingScholarshipCode===1 ?? false,
      billingTaxCode: location?.state?.data?.billing?.billingTaxCode===1 ?? false,
      billingPrice: location?.state?.data?.billing?.billingPrice ?? 0,
      billingPayment: location?.state?.data?.billing?.billingPayment ?? 0,
      billingGroup: location?.state?.data?.billing?.billingGroup ?? 0,
      billingUnpaidCode: 0
    }
  );
  const billingScholarshipCodeTag = billing.useHandlarCheckbox('billingScholarshipCode');
  const lessonMonths = location.state?.data?.availableRange;
  return (
    <>
      <Register
        billingScholarshipCodeTag={billingScholarshipCodeTag}
        useHandlar={billing.useHandlar}
        useHandlarCheckbox={billing.useHandlarCheckbox}
        values={billing.values}
      />
      <Month
        useHandlarCheckbox={lessonMonth.useHandlarCheckbox}
        lessonMonths={lessonMonths}
      />
      <PostButton
        studentID={location.state?.data?.billing.studentID}
        studentName={location.state?.data?.billing.studentName}
        billing={billing}
        lessonMonths={lessonMonth}
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
            {location.state?.data?.billing.studentName} 학생 입금 내역 등록
          </Typography>
        </Box>
      </Box>
      {location.state?.status === 200 && <Optional />}
    </Page>
  );
}
