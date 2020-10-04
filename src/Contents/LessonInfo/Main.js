import React, { useContext, useState, useCallback, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Root } from '../../NavigationBar/Root';
import axios from 'axios';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';

export default function Main() {
  const { quarterID, lessonMonth } = useParams();
  const [ fd, setFd ] = useState(null);
  const { setStudyWeeks } = useContext(Root);
  useLayoutEffect(() => {
    if(fd !== null) return;
    axios.get(`/api/teacher/lesson/${quarterID}/${lessonMonth}`)
    .then(r => setFd(r.data.fetchedData))
    .catch(alert);
  }, [ fd ]);
  useLayoutEffect(() => {
    if(!fd) return;
    setStudyWeeks({
      week1: fd[0].studyWeek1,
      week2: fd[0].studyWeek2,
      week3: fd[0].studyWeek3,
      week4: fd[0].studyWeek4,
    });
  }, [ fd ]);

  if(!fd) return (<>조회중</>);
  if(typeof fd ==='string') return (<>{fd}</>);
  return (
    <>
      {fd.map(row => <Box><Card>
        <CardContent>
          <h1>{row.quarterName}</h1>
          <h3>{row.teacherName}</h3>
{row.studyWeek1}
        </CardContent>
      </Card></Box>)}
    </>
  );

}
