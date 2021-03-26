import React from 'react';
import * as ReactRouter from 'react-router-dom';
import queryString from 'query-string';
import AdminPages from './AdminPageRoutes';
import UserPages from './UserPageRoutes';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));
const Copyright = () => (
  <>
    <Typography variant="body2" color="textSecondary" align="center">
      Copyright &copy; ky {new Date().getFullYear()}.
    </Typography>
  </>
);
export default function({
  auth,
  children
}) {
  const classes = useStyles();
  const location = ReactRouter.useLocation();
  const query = queryString.parse(location.search);
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth={(query?.pg) ? 'lg' : 'sm'} className={classes.container}>
        <Grid container spacing={2}>
          <UserPages/>
          {auth && auth.op ? <AdminPages /> : null}
        </Grid>
        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    </main>
  );
}
