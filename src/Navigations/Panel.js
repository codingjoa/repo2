import React from 'react';
import { Link as LinkComponent, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import AdminGNB from '../Navigations/AdminGNBContents';
import UserGNB from '../Navigations/UserGNBContents';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';

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

export default ({
  auth,
  children,
  navOpen, // 내비게이션 상태
  setNavOpen // 내비게이션 열기 닫기용
}) => {
  const classes = useStyles();
  const location = useLocation();
  React.useLayoutEffect(() => {
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
        <Box flexGrow={1}>
          {sessionStorage.teacherName} 선생님
        </Box>
        <Box>
          <Link color="primary" component={LinkComponent} to="/account/password">비밀번호 변경</Link>
        </Box>
      </div>
      <Divider />
      <List>
        <div>
          <UserGNB />
          {auth && auth.op ? <AdminGNB /> : null}
        </div>
      </List>
    </Drawer>
  );
}
