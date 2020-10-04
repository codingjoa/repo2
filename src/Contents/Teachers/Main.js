import React, { useContext, useState, useCallback, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Root } from '../../NavigationBar/Root';
import axios from 'axios';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';


import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import CircularProgress from '@material-ui/core/CircularProgress';

import Page from '../../Templates/Page';


function Create(reload) {
  const r = window.confirm('새 반을 만들까요?');
  if(!r) return;
  axios.post('/api/test/quarter')
  .then(r => {
    reload();
  })
  .catch(e => {
    if(e.response?.status===400 && !alert(`생성 실패: ${e.response.data.cause}`)) return;
    alert(e);
  });
}

function Delete({ id, name, reload, disable }) {
  const question = useCallback(() => {
    const r = window.confirm(`${name} 반을 명부에서 삭제합니다.`);
    if(!r) return;
    axios.delete(`/api/test/teacher/${id}`)
    .then(() => {
      reload();
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`삭제 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, []);
  
  return (
    <div>
      <IconButton disabled={disable} onClick={question} color="secondary">
        <Tooltip TransitionComponent={Zoom} title={disable ? '관리자는 삭제할 수 없음.': '삭제'}>
          <DeleteIcon />
        </Tooltip>
      </IconButton>
    </div>
  );
}

function Edit({ id, name, reload }) {
  const question = useCallback(() => {
    const newName = prompt('변경할 이름을 입력', name);
    if(newName === null) return;
    axios.put(`/api/test/teacher/${id}`, { teacherName: newName })
    .then(() => {
      reload();
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`변경 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, []);

  return (
    <div style={{ display: 'inline' }}>
      <IconButton onClick={question} color="action">
        <EditIcon />
      </IconButton>
    </div>
  );
}

export default function Main() {
  const { quarterID, lessonMonth } = useParams();
  const [ fd, setFd ] = useState(null);
  const { setStudyWeeks } = useContext(Root);
  useLayoutEffect(() => {
    if(fd !== null) return;
    axios.get(`/api/test/teacher/`)
    .then(r => setFd(r.data.fetchedData))
    .catch(alert);
  }, [ fd ]);

  if(!fd) return (<CircularProgress />);
  if(typeof fd ==='string') return (<>{fd}</>);
  return (
    <>
      <Fab onClick={e => Create(f => setFd(null))}>
        <AddIcon />
      </Fab>
      {fd.map(row => <Page>
        <Box display="flex" flexDirection="row" flexWrap="noWrap">
          <Box alignSelf="center" flexGrow={1}>{row.teacherName}({row.teacherAccount})</Box>
          <Box><Edit name={row.teacherName} id={row.teacherID} reload={e => setFd(null)}/></Box>
          <Box><Delete name={row.teacherName} id={row.teacherID} reload={e => setFd(null)} disable={row.teacherOp === 1} /></Box>
        </Box>
      </Page>)}
    </>
  );

}
