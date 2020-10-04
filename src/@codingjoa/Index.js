import React, { useState, useCallback, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import { TimeString } from './TimeString';

import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from 'material-ui-popup-state/hooks';

function ChangePassword({ reload }) {
  const pwi = useRef(null);
  const n1i = useRef(null);
  const n2i = useRef(null);

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'demoPopover',
  });
  const tryPasswordChange = useCallback(() => {
    const [ pw, newpw, newpwCheck ] = [
      pwi.current.value,
      n1i.current.value,
      n2i.current.value
    ];
    if(newpw !== newpwCheck) {
      alert('확인 비밀번호가 일치하지 않음.');
      return;
    }
    axios.put('/api/db/me', { pw, newpw })
    .then(r => {
      r.status===204 && alert('비밀번호가 변경되었습니다.');
      reload();
    })
    .catch(e => alert(`변경 실패: ${e.response.data.cause}`));
  }, []);

  return (
    <>
      <div style={{ maxWidth: '250px' }}>
        <Button
          {...bindTrigger(popupState)}
          variant="contained"
        >
          비밀번호 변경...
        </Button>
      </div>
      <Popover
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
        <TextField inputRef={pwi} type="password" autoComplete="current-password" label="현재 비밀번호" />
        <TextField inputRef={n1i} type="password" autoComplete="new-password" label="새 비밀번호" />
        <TextField inputRef={n2i} type="password" autoComplete="new-password" label="새 비밀번호 확인" />
        <Button
          variant="contained" 
          onClick={tryPasswordChange}
        >
          비밀번호 변경
        </Button>
      </Popover>
    </>
  );
}

export default function Index({ tid }) {
  const [ info, setInfo ] = useState(null);
  useLayoutEffect(() => {
    if(info !== null) return;
    axios.get(`/api/db/me`)
    .then(r => r.data)
    .then(setInfo)
    .catch(e => alert(e.response.status));
  }, [ info ]);
  const myInfo = useMemo(() => {
    return ( info ?? undefined ) && info?.fetchedData && info?.fetchedData[0];
  }, [info]);
  
  return (<>
    <Typography variant="h4" color="primary" gutterBottom>
      {myInfo?.teacherName ?? '...'} 선생님
    </Typography>
    <Grid container style={{ maxWidth: '400px' }}>
      <Grid item xs={4}>
        <Typography variant="caption" color="primary">
          반 수
        </Typography>
        <Typography variant="h6" color="primary">
          {myInfo?.qlen ?? 0}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="caption" color="primary">
          학생 수
        </Typography>
        <Typography variant="h6" color="primary">
          {myInfo?.stlen ?? 0}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="caption" color="primary">
          수업 횟수
        </Typography>
        <Typography variant="h6" color="primary">
          {myInfo?.slen ?? 0}
        </Typography>
      </Grid>
    </Grid>
    <ChangePassword reload={() => setInfo(null)} />
    <Typography variant="button" color="primary">
      비밀번호 변경일: { (myInfo?.teacherModifiedPassword && TimeString(myInfo?.teacherModifiedPassword)) ?? '기록 없음.'}
    </Typography>
  </>);
}
