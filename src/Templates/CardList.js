import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  }
}));

export default function CardPage({ children }) {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Card className={classes.paper}>
        { children }
      </Card>
    </Grid>
  );
}
