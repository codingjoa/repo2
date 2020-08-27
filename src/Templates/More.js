import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function More(props) {
  const classes = useStyles();
  return (
    <div className={classes.seeMore}>
      <Button color="primary" href={props.href ?? ''} onClick={preventDefault}>
        {props.children}
      </Button>
    </div>
  );
}
