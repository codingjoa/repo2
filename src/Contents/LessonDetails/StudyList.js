import React from 'react';
import * as ReactRouter from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Page from '../../Templates/Page';


export default () => {
  const { quarterID, lessonMonth } = ReactRouter.useParams();
  const location = ReactRouter.useLocation();
  const btn = ({ studyWeek, studyProgressed }) => (
    <Grid item xs={3} sm={2}>
      <Button
        fullWidth
        variant="contained"
        color={studyProgressed ? 'secondary' : 'default'}
        component={ReactRouter.Link}
        to={`/lesson/detail/${quarterID}/${lessonMonth}/study/${studyWeek}`}
      >
        {studyWeek}주차
      </Button>
    </Grid>
  );
  return (
    <>
      <Typography variant="subtitle1">
        출석부 목록
      </Typography>
      <Page>
        <Grid container spacing={1}>
          {location.state.data.studies.map(btn)}
        </Grid>
      </Page>
    </>
  );
}
