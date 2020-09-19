import React, { useState, useCallback, useLayoutEffect, useRef } from 'react';
import axios from 'axios';

import OrderBy from './OrderBy';
import Search from './Search';
import SortedTable from './SortedTable';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from 'material-ui-popup-state/hooks';

function TeacherInfo({ reload, teacherID: tid, teacherName: name, teacherOp: op, teacherAccount, slen, qlen, stlen }) {
/* @codingjoa
   선생 정보를 1줄 출력하는 컴포넌트
*/
  return (
    <>
      <TableCell>
        {tid}
      </TableCell>
      <TableCell>
        <Grid container>
          <Grid item xs={6}>
            {name}
          </Grid>
          <Grid item xs={6}>
            <Rename tid={tid} name={name} reload={reload} />
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        {qlen}
      </TableCell>
      <TableCell>
        {stlen}
      </TableCell>
      <TableCell>
        {slen}
      </TableCell>
      <TableCell>
        {teacherAccount}
      </TableCell>
      <TableCell>
        <RegenPasswd tid={tid} name={name}/>
      </TableCell>
      <TableCell>
        {!op ? <Delete tid={tid} name={name} reload={reload}/> : <></>}
      </TableCell>
    </>
  );
}

function Create({ reload }) {
  const idi = useRef(null);
  const nmi = useRef(null);

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'demoPopover',
  });
  const trying = useCallback(() => {
    const [ id, name ] = [
      idi.current.value,
      nmi.current.value
    ];
    axios.post('/api/db/teacher', { id, name })
    .then(r => {
      r.status===201 && alert(`${name} 선생님의 계정이 생성되었습니다. 임시 비밀번호는 ${r.data.createdData.password}입니다.`);
      reload();
      popupState.setAnchorEl(null);
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`생성 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, []);

  return (
    <div>
      <IconButton color="action" {...bindTrigger(popupState)}>
        <AddIcon />
      </IconButton>
      <Popover style={{ padding: '1em', maxWidth: '300px' }}
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography color="primary" variant="h6">새로운 선생님 추가</Typography>
        <TextField fullWidth inputRef={idi} type="email" autoComplete="username" label="아이디" />
        <TextField fullWidth inputRef={nmi} type="text" autoComplete="name" label="이름" />
        <Button
          style={{ textAlign: 'center' }}
          variant="contained" 
          onClick={trying}
        >
          선생님 추가
        </Button>
      </Popover>
    </div>
  );
}

function Delete({ tid, name, reload }) {
  const question = useCallback(() => {
    const r = window.confirm(`${name} 선생님을 명부에서 삭제합니다.`);
    if(!r) return;
    axios.delete(`/api/db/teacher/${tid}`)
    .then(reload)
    .catch(e => {
      if(e.response?.status===400 && !alert(`삭제 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, []);
  
  return (
    <div>
      <IconButton onClick={question} color="secondary">
        <DeleteIcon />
      </IconButton>
    </div>
  );
}

function Rename({ tid, name, reload }) {
  const question = useCallback(() => {
    const newName = prompt('변경할 이름을 입력', name);
    if(newName === null) return;
    axios.put(`/api/db/teacher/${tid}`, { name: newName })
    .then(reload)
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

function RegenPasswd({ tid, name }) {
  const question = useCallback(() => {
    const r = window.confirm(`${name} 선생님의 비밀번호를 초기화할까요?`);
    if(!r) return;
    axios.post(`/api/db/teacher/reset/${tid}`)
    .then(r => r.status === 201 && alert(`비밀번호 초기화에 성공. 임시 비밀번호는 ${r.data.createdData.password}입니다.`))
    .catch(e => {
      if(e.response?.status===400 && !alert(`변경 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, []);
  
  return (
    <div>
      <Link onClick={question} color="primary">
        초기화
      </Link>
    </div>
  );
}


export default function Teacher() {
  const [ teachers, setTeachers ] = useState(null);
  const [ qid, setQuarter ] = useState(0);
  const [ orderby, setOrderby ] = useState(null);
  const [ searchKeyword, setSearchKeyword ] = useState('');

  const reload = useCallback(() => setTeachers(null), []);
  useLayoutEffect(() => {
    if(teachers !== null) return;
    axios.get('/api/db/teacher')
    .then(r => setTeachers(r.data.fetchedData))
    .catch(e => {
      e.response?.status===400 && alert(`오류: ${e.response.data.cause}`);
      e.response?.status===404 && alert('조회된 데이터 없음.');
      setTeachers(false);
    });
  }, [ teachers ]);

  return (
    <>
      <Grid container>
        <Grid item xs={4}>
          <Create reload={reload} />
        </Grid>
        <Grid item xs={4}>
          ?
        </Grid>
        <Grid item xs={4}>
          <OrderBy
            orderby={orderby}
            setOrderby={setOrderby}
            orderList={[{ key: 'teacherID', visualName: '번호'}, { key: 'teacherName', visualName: '이름'}, { key: 'qlen', visualName: '반'}, { key: 'stlen', visualName: '학생 수'}, { key: 'slen', visualName: '수업 횟수'}]}
          />
        </Grid>
        <Grid item xs={12}>
          <Search setSearchKeyword={setSearchKeyword} />
        </Grid>
      </Grid>
      <SortedTable
        Info={TeacherInfo}
        fieldNames={ ['번호', '이름', '반', '학생 수', '수업 횟수', '아이디', '비밀번호', '삭제'] }
        axiosResult={teachers}
        orderby={orderby}
        searchKeyword={searchKeyword}
        searchColumn={'teacherName'}
        reload={reload}
      />
    </>
  );
}
