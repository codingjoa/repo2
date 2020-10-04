import React, { useContext, useState, useCallback, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Root } from '../../NavigationBar/Root';
import axios from 'axios';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';

import CircularProgress from '@material-ui/core/CircularProgress';

import Page from '../../Templates/Page';



export default function Main() {
  const { quarterID, lessonMonth } = useParams();
  const [ fd, setFd ] = useState(null);
  const { setStudyWeeks } = useContext(Root);
  useLayoutEffect(() => {
    if(fd !== null) return;
    axios.get(`/api/test/fetch/`)
    .then(r => setFd(r.data.fetchedData))
    .catch(alert);
  }, [ fd ]);

  if(!fd) return (<CircularProgress />);
  if(typeof fd ==='string') return (<>{fd}</>);
  return (
    <>
      {fd.map(row => <Page>
        <CardContent>
          <h1>{row.studentName}</h1>
          <h3>{row.studentID}</h3>
        </CardContent>
      </Page>)}
    </>
  );

}
