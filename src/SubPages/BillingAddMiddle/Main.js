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
import StartStudyWeek from './StartStudyWeek';
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
function fetchBilling(
  studentID,
  quarterID,
  lessonMonth,
  callback
) {
  axios.get(`/api/admin/billing/${studentID}/recent`)
  .then(result =>
    fetchLessonDetailsAdmin(result.data.fetchedData, quarterID, lessonMonth, callback),
    callback
  );
}
function fetchLessonDetailsAdmin(
  billing,
  quarterID,
  lessonMonth,
  callback
) {
  if(!billing) {
    callback(new Error('입금 내역 조회 중 오류가 발생했습니다.'));
    return;
  }
  axios.get(`/api/admin/lesson/details/${quarterID}/${lessonMonth}`)
  .then(result => callback(null, {
    data: {
      fetchedData: {
        lesson: result.data?.fetchedData,
        billing
      }
    }
  }), callback);
};
function addBillingMiddle(
  studentID,
  lessonMonth,
  billing,
  callback
) {
  const {
    billingPrice,
    billingGroup,
    billingPayment,
    billingTaxCode,
    billingScholarshipCode,
    billingUnpaidCode,
    startStudyWeek
  } = billing;
  const body = {
    billingPrice,
    billingGroup,
    billingPayment,
    billingTaxCode: (billingTaxCode===true ? 1 : 0),
    billingScholarshipCode: (billingScholarshipCode===true ? 1 : 0),
    billingUnpaidCode: billingUnpaidCode,
    startStudyWeek
  };
  axios.post(`/api/admin/billing/${studentID}/${lessonMonth}/middle`, body)
  .then(
    result => callback(null, result),
    callback
  );
}
function PostButton({
  studentID,
  studentName,
  billing,
  lessonMonth
}) {
  const history = ReactRouter.useHistory();
  const handleSubmit = () => {
    const userAnswer = window.confirm(`${studentName} 학생을 중도 등록합니다.`);
    if(!userAnswer) {
      return;
    }
    billing.getValues(billingValues => {
      addBillingMiddle(studentID, lessonMonth, billingValues, err => {
        if(err) {
          alert(err?.response?.data?.cause ?? err);
          return;
        }
        alert('등록되었습니다.');
        history.goBack();
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
function Optional({
  lessonMonth
}) {
  const location = ReactRouter.useLocation();
  const billing = FormHandlar(
    () => 0, {
      billingScholarshipCode: location?.state?.data?.billing?.billingScholarshipCode===1 ?? false,
      billingTaxCode: location?.state?.data?.billing?.billingTaxCode===1 ?? false,
      billingPrice: location?.state?.data?.billing?.billingPrice ?? 0,
      billingPayment: location?.state?.data?.billing?.billingPayment ?? 0,
      billingGroup: location?.state?.data?.billing?.billingGroup ?? 0,
      billingUnpaidCode: 0,
      startStudyWeek: 1
    }
  );
  const billingScholarshipCodeTag = billing.useHandlarCheckbox('billingScholarshipCode');
  return (
    <>
      <Register
        billingScholarshipCodeTag={billingScholarshipCodeTag}
        useHandlar={billing.useHandlar}
        useHandlarCheckbox={billing.useHandlarCheckbox}
        values={billing.values}
      />
      <StartStudyWeek
        studySize={location?.state?.data?.lesson?.studySize}
        useHandlar={billing.useHandlar}
      />
      <PostButton
        studentID={location?.state?.data?.billing?.studentID}
        studentName={location?.state?.data?.billing?.studentName}
        billing={billing}
        lessonMonth={lessonMonth}
      />
    </>
  );
}

export default function() {
  const history = ReactRouter.useHistory();
  const location = ReactRouter.useLocation();
  const {
    studentID,
    quarterID,
    lessonMonth
  } = ReactRouter.useParams();
  const callback = getHandlar(history.replace);
  React.useLayoutEffect(() => {
    fetchBilling(
      studentID,
      quarterID,
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
            {location.state?.data?.billing?.studentName} 학생 입금 내역 등록
          </Typography>
          <Typography
            color="primary"
            variant="caption"
          >
            {location.state?.data?.lesson?.quarterName} 팀, {lessonMonthToString(location.state?.data?.lesson?.lessonMonth)} 수업
          </Typography>
        </Box>
      </Box>
      {location.state?.status === 200 &&
        <Optional
          lessonMonth={lessonMonth}
        />
      }
    </Page>
  );
}
