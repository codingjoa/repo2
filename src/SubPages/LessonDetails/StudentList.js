import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function toYear(origin) {
  return (new Date(origin)).getFullYear();
}

export default ({
  students
}) => {
  const { quarterID, lessonMonth } = useParams();
  return (
    <>
      <Typography variant="subtitle1">
        학생 목록
      </Typography>
      <Grid
        container
        spacing={2}
      >
        {students && students.map(({
          studentID, studentNameDup, studentBirthday,
          billingPrice, billingScholarshipCode, billingTaxCode
        }) => (
          <Grid
            item
            xs={4}
          ><Page>
          <Box>
            <Box
              textAlign="center"
            >
              <Typography variant="h6">
                {studentNameDup}
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
                color="primary"
                component={Link}
                to={`/lesson/detail/${quarterID}/${lessonMonth}/student/${studentID}`}
                variant="contained"
              >
                인적사항
              </Button>
            </Box>
          </Box>
        </Page></Grid>))}
      </Grid>
    </>
  );
}
