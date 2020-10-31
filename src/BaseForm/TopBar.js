import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

export default function TopBar({ children }) {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        {children}
      </AppBar>
    </>
  );
}
