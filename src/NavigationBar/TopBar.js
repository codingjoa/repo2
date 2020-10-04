import React, { useContext, useState } from 'react';
import { Route, Link, useParams } from 'react-router-dom';
import { Root } from './Root';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: 0,
  },
  menuButtonHidden: {
    display: 'none',
  },
}));

function a11yProps(index) { return { id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}`, }; } 

export default function TopBar({ children }) {
  const classes = useStyles();
  const { navOpen, setNavOpen, studyWeeks } = useContext(Root);
  const [ tab, setTab ] = useState(0);
  const { quarterID, lessonMonth } = useParams();

  return (
    <>
    <CssBaseline />
    <AppBar position="absolute" className={classes.appBar}>
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
      <Route path="/lesson/:quarterID/:lessonMonth">
      <Toolbar disableGutter={true} variant="dense">
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
        <Tab label="개요" {...a11yProps(0)} />
        <Tab label="1주차" disabled={ studyWeeks?.week1 > 0 ? false : true } {...a11yProps(1)} component={Link} to={`/lesson/${quarterID}/${lessonMonth}/study/1`}/>
        <Tab label="2주차" disabled={ studyWeeks?.week2 > 0 ? false : true } {...a11yProps(2)} component={Link} to="study/2"/>
        <Tab label="3주차" disabled={ studyWeeks?.week3 > 0 ? false : true } {...a11yProps(3)} component={Link} to="study/3"/>
        <Tab label="4주차" disabled={ studyWeeks?.week4 > 0 ? false : true } {...a11yProps(4)} component={Link} to="study/4"/>
<Tab label="학생 목록" {...a11yProps(5)} />
</Tabs>
      </Toolbar>
      </Route>
    </AppBar>
    </>
  );
}
