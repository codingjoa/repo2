import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Page from '../../Templates/Page';

export default () => {
  const { quarterID, lessonMonth } = useParams();
  return (
    <>
      <Typography variant="subtitle1">
        출석부 목록
      </Typography>
      <Page>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to={`/lesson/detail/${quarterID}/${lessonMonth}/study/1`}
            >
              1주차
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to={`/lesson/detail/${quarterID}/${lessonMonth}/study/2`}
            >
              2주차
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to={`/lesson/detail/${quarterID}/${lessonMonth}/study/3`}
            >
              3주차
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to={`/lesson/detail/${quarterID}/${lessonMonth}/study/4`}
            >
              4주차
            </Button>
          </Grid>
        </Grid>
      </Page>
    </>
  );
}
