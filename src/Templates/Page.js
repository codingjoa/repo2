import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
  }
}));

export default function Page(props) {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        { props.children }
      </Paper>
    </Grid>
  );
}
