import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    Copyright &copy;
    <Link color="inherit" href="https://material-ui.com/">
      ky
    </Link>{' '}
    {new Date().getFullYear()}.
  </Typography>
);
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
export default function SignIn({
  signIn
}) {
  const classes = useStyles();
  const idRef = React.useRef();
  const passwordRef = React.useRef();
  const trySignIn = React.useCallback((e) => {
    e.preventDefault();
    const id = idRef.current.value;
    const pw = passwordRef.current.value;
    signIn(id, pw);
  }, []);
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div
        className={classes.paper}
      >
        <Avatar
          className={classes.avatar}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
        >
          학원관리 프로그램
        </Typography>
        <form
          className={classes.form}
          noValidate
        >
          <TextField
            autoComplete="email"
            autoFocus
            fullWidth
            id="email"
            inputRef={idRef}
            label="아이디"
            margin="normal"
            name="id"
            required
            variant="outlined"
          />
          <TextField
            autoComplete="current-password"
            fullWidth
            id="password"
            inputRef={passwordRef}
            label="비밀번호"
            margin="normal"
            name="password"
            required
            type="password"
            variant="outlined"
          />
          <Button
            fullWidth
            className={classes.submit}
            color="primary"
            onClick={trySignIn}
            type="submit"
            variant="contained"
          >
            로그인
          </Button>
        </form>
      </div>
      <Box
        mt={8}
      >
        <Copyright />
      </Box>
    </Container>
  );
}
