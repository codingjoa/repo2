import React, { useContext } from 'react';
import { Root } from '../NavigationBar/Root';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles(title => ({
  title: {
    flexGrow: 1,
  },
}));

export default function TopBarContents() {
  const classes = useStyles();
  const { auth, signOut } = useContext(Root);
  return (
  <>
    <Typography variant="h6" color="inherit" noWrap className={classes.title}>
      학원관리 프로그램
    </Typography>
    <IconButton color="inherit" onClick={signOut}>
      <ExitToAppIcon />
    </IconButton>
  </>
  );
}
