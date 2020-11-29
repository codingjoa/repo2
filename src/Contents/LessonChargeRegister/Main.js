import React from 'react';
import * as ReactRouter from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Page from '../../Templates/Page';
import SelectStudySize from './SelectStudySize';
import SelectingTeacher from './SelectingTeacher';
import Submit from './Submit';
import GoBack from './GoBack';
import { Context } from './Context';
const DO = new Date();

export default function() {
  const [ pickedTeacher, setPickedTeacher ] = React.useState(null);
  const [ pickedSize, setPickedSize ] = React.useState(4);
  const location = ReactRouter.useLocation();
  return (
    <Context.Provider
      value={{
        pickedTeacher,
        setPickedTeacher,
        pickedSize,
        setPickedSize
      }}
    >
      <Typography variant="subtitle1">
        수업 등록
      </Typography>
      <Grid container item
        xs={12}
        spacing={1}
      >
        <Grid item xs={6}>
          <Typography
            variant="subtitle2"
          >
            수업하는 달
          </Typography>
          <Typography
            variant="h6"
            color="primary"
          >
            {DO.getFullYear()}년 {DO.getMonth()+1}월
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="subtitle2"
          >
            담당 반
          </Typography>
          <Typography
            variant="h6"
            color="primary"
          >
            {location.state.quarterName}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography
            variant="subtitle2"
          >
            담당 선생님
          </Typography>
          <SelectingTeacher />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography
            variant="subtitle2"
          >
            총 수업 횟수
          </Typography>
          <SelectStudySize />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex">
          <Box mr={1}><Submit /></Box>
          <Box><GoBack /></Box>
        </Box>
      </Grid>
    </Context.Provider>
  );

}
