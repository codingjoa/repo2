import React, { useContext, useLayoutEffect } from 'react';
import { Link as LinkComponent, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Root } from './Root';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  }
}));

export default function NavigationBar({ children }) {
  const classes = useStyles();
  const { auth, navOpen, setNavOpen } = useContext(Root);
  const location = useLocation();
  useLayoutEffect(() => {
    setNavOpen(false);
  }, [ location ]);
  return (
    <Drawer
      variant="temporary"
      classes={{
        paper: clsx(classes.drawerPaper, !navOpen && classes.drawerPaperClose),
      }}
      open={navOpen}
      onClose={e => setNavOpen(false)}
    >
      <div className={classes.toolbarIcon}>
        <Box flexGrow={1}>{auth.name} 선생님</Box>
        <Box>
          <Link color="primary" component={LinkComponent} to="/account/password">비밀번호 변경</Link>
        </Box>
      </div>
      <Divider />
      <List>{children}</List>
    </Drawer>
  );
}
