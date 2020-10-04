import React, { useState, useCallback, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CircularProgress from '@material-ui/core/CircularProgress';


import Box from '@material-ui/core/Box';

import CardList from '../../Templates/CardList';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  card: {
    width: '1vw',
  }
}));

function toDateFormat(origin) {
  const time = new Date(origin);
  return `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`;
}

export default function Main() {
  const classes = useStyles();
  const [ fd, setFd ] = useState(null);
  useLayoutEffect(() => {
    if(fd !== null) return;
    axios.get('/api/teacher/lesson')
    .then(r => setFd(r.data.fetchedData))
    .catch(alert);
  }, [ fd ]);
  if(!fd) return (<CircularProgress />);
  if(typeof fd ==='string') return (<>{fd}</>);
  return (
    <>
      {fd.map(row => <CardList>
        <CardActionArea>
        <Link to={`/lesson/${row.quarterID}/${toDateFormat(row.lessonMonth)}`}>
        <CardContent>
          <h1>{row.quarterID}</h1>
          <h3>{row.lessonMonth}</h3>
        </CardContent>
        </Link>
        </CardActionArea>
      </CardList>)}
    </>
  );

}
