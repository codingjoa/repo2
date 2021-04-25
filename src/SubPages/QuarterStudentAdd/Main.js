import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import { getHandlar } from '../../Templates/Format';
import FormHandlar from '../../Templates/FormHandlar';
import Page from '../../Templates/Page';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
function fetchIndependentStudents(callback) {
  axios.get('/api/teacher/students')
  .then(result => callback(null, result), callback);
}
function addQuarterStudents(quarterID, values, callback) {
  axios.post(`/api/dev/teacher/students/${quarterID}`, {
    students: Object.entries(values).filter(row => row[1] === true).map(row => row[0])
  })
  .then(result => callback(null, result), callback);
}
function List() {
  // checkbox handlar
  const { quarterID } = ReactRouter.useParams();
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const handlar = FormHandlar();
  const handleSubmit = () => {
    handlar.getValues(values => {
      addQuarterStudents(quarterID, values, err => {
        if(err) {
          alert(err?.response.data?.cause ?? err);
          return;
        }
        history.goBack();
      });
    });
  };
  const WithCheckbox = row => (
    <Grid
      item
      key={row.studentID}
      xs={4}
    >
      <Page>
        <Box
          display="flex"
        >
          <Box
            alignSelf="center"
            flexGrow={1}
          >
            {row.studentID}: {row.studentName}
          </Box>
          <Box>
            <Checkbox
              {...handlar.useHandlarCheckbox(row.studentID)}
            />
          </Box>
        </Box>
      </Page>
    </Grid>
  )
  return (
    <>
      <Box>
        <Typography
          variant="subtitle1"
        >
          팀에 학생 추가하기
        </Typography>
      </Box>
      {location.state?.data.map(WithCheckbox)}
      <Button
        onClick={handleSubmit}
      >
        보내기
      </Button>
    </>
  );
}
export default function() {
  // react-router-dom 기반 fetch to state
  const location = ReactRouter.useLocation();
  const history = ReactRouter.useHistory();
  const callback = getHandlar(history.replace);
  React.useLayoutEffect(() => {
    fetchIndependentStudents(callback);
  }, []);
  return (
    <>{
      location.state?.status===200 &&
      <List />
    }</>
  );
};
