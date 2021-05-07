import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const TopLine = ({
  setNavOpen,
  signOut
}) => (
  <>
    <Box
      display="flex"
      alignItems="center"
      flexDirection="row"
    >
      <Box

      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => setNavOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Box
        flexGrow={1}
      >
        <Typography
          color="inherit"
        >
          학원관리 프로그램
        </Typography>
      </Box>
      <Box>
        <IconButton color="inherit" onClick={signOut}>
          <ExitToAppIcon />
        </IconButton>
      </Box>
    </Box>
  </>
);
export default function({
  setNavOpen,
  signOut
}) {
  const classes = useStyles();
  return (<>
    <CssBaseline />
    <AppBar
      position="absolute"
      className={classes.appBar}
    >
      <Toolbar
        variant="regular"
      >
        <Grid
          item
          xs={12}
        >
          <TopLine
            setNavOpen={setNavOpen}
            signOut={signOut}
          />
        </Grid>
      </Toolbar>
    </AppBar>
  </>);
}
