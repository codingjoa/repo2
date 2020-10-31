import React, {
  useState
} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import SelectingTeacher from './SelectingTeacher';
import Submit from './Submit';
import GoBack from './GoBack';
import { Context } from './Context';
const DO = new Date();

export default function() {
  const [ pickedTeacher, setPickedTeacher ] = useState(null);
  const location = useLocation();
  return (
    <Context.Provider
      value={{
        pickedTeacher,
        setPickedTeacher
      }}
    >
      <Typography variant="h5">
        수업 등록
      </Typography>
      <Grid item xs={12}>
        <Typography variant="body1">
          <Typography color="primary">{DO.getFullYear()}년 {DO.getMonth()+1}월 "{location.state.quarterName}"의</Typography> 수업을
          <SelectingTeacher />선생님이 담당합니다.
        </Typography>
        <Box display="flex">
          <Box><Submit /></Box>
          <Box><GoBack /></Box>
        </Box>
      </Grid>
    </Context.Provider>
  );

}
