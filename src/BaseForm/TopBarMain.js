import React from 'react';
import { Root } from './Root';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  menuButton: {
    marginRight: 0,
  },
}));

export default function({ children }) {
  const classes = useStyles();
  const { setNavOpen } = React.useContext(Root);
  return (
    <Toolbar className={classes.toolbar}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={() => setNavOpen(true)}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
      {children}
    </Toolbar>
  );
}
