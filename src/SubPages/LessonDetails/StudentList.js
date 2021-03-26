import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function toYear(origin) {
  return (new Date(origin)).getFullYear();
}
function Pricing({
  billingPrice
}) {

}

export default ({ students }) => {
  const { quarterID, lessonMonth } = useParams();
  return (
    <>
      <Typography variant="subtitle1">
        학생 목록
      </Typography>
      {students && students.map(({
        studentID, studentName, studentBirthday,
        billingPrice, billingScholarshipCode, billingTaxCode
      }) => <Page>
        <Box display="flex">
          <Box
            flexGrow={1}
            alignSelf="center"
          >
            <Typography variant="h6">
              {studentName}{studentBirthday && `(${toYear(studentBirthday)}년)`}
            </Typography>
            <Typography variant="subtitle2">
              {(billingPrice === null || billingPrice === undefined) ? null : `${numberWithCommas(`${billingPrice}`)} 원`}
              {(billingTaxCode === 1) ? '(특수)' : null}
            </Typography>
            <Typography variant="subtitle2">
              {(billingScholarshipCode === null || billingScholarshipCode === undefined) ? '비장학' : ((billingScholarshipCode===1) ? '장학' : '비장학')}
            </Typography>
          </Box>
          <Box>
            <Button
              component={Link}
              to={`/lesson/detail/${quarterID}/${lessonMonth}/student/${studentID}`}
            >
              상세보기
            </Button>
          </Box>
        </Box>
      </Page>)}
    </>
  );
}
