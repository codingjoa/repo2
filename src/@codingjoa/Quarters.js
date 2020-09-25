import React, { useState, useCallback, useRef, useEffect, useLayoutEffect, useMemo } from 'react';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Popover from '@material-ui/core/Popover';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from 'material-ui-popup-state/hooks';

import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

import OrderBy from './OrderBy';
import SortedTable from './SortedTable';
import Search from './Search';
import { TimeString, CurrentAge } from './TimeString';

import axios from 'axios';

function QuarterSelect({ qid, quarters, selectQuarter }) {
  /*
  if(quarters === null) {
    return (
      <>반 목록을 불러오는 중...</>
    );
  }
  else if(quarters === false) {
    return (
      <>반 조회 실패</>
    );
  }*/
  return (
    <>
      <Select style={{width: '100%'}} value={qid} onChange={e => selectQuarter(e.target.value)}>
        {quarters === null && 
          <MenuItem value={qid}>불러오는 중</MenuItem>
        }
        {quarters === false && 
          <MenuItem value={qid}>조회 실패</MenuItem>
        }
        {quarters && quarters.map(row => 
          <MenuItem value={row.quarterID}>{row.quarterName}</MenuItem>
        )}
      </Select>
    </>
  );

}

function QuarterCreate({ reload }) {
  const question = useCallback(() => {
    const r = window.confirm('새 반을 만들까요?');
    if(!r) return;
    axios.post('/api/db/quarter')
    .then(r => {
      reload(r.data.createdData?.quarterID ?? false);
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`생성 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, []);
  
  return (
    <div>
      <IconButton onClick={question} color="primary">
        <AddIcon />
      </IconButton>
    </div>
  );
}

function QuarterDelete({ qid, name, reload }) {
  const question = useCallback(() => {
    const r = window.confirm(`${name} 반을 명부에서 삭제합니다.`);
    if(!r) return;
    axios.delete(`/api/db/quarter/${qid}`)
    .then(() => {
      reload();
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`삭제 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, [ qid ]);
  
  return (
    <div>
      <IconButton onClick={question} color="secondary">
        <DeleteIcon />
      </IconButton>
    </div>
  );
}

function QuarterEdit({ qid, name, selectQuarter, reload }) {
  const question = useCallback(() => {
    const newName = prompt('변경할 이름을 입력', name);
    if(newName === null) return;
    axios.put(`/api/db/quarter/${qid}`, { name: newName })
    .then(() => {
      reload(qid);
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`변경 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, [ qid ]);

  return (
    <div style={{ display: 'inline' }}>
      <IconButton onClick={question} color="action">
        <EditIcon />
      </IconButton>
    </div>
  );
}



function StudentUniqueness({ stid, studentUniqueness, reload }) {
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'demoPopover',
  });
  const origin = useMemo(() => studentUniqueness, []);
  const [ text, setText ] = useState(origin);

  const send = useCallback(() => {
    axios.patch(`/api/db/student/${stid}`, { uniqueness: text })
    .then(r => {
      reload();
      popupState.setAnchorEl(null);
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`변경 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, [ text ]);

  return (
    <>
      <Link {...bindTrigger(popupState)}>
        보기
      </Link>
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
        <Typography color="primary" variant="h6" >
          학생 특이사항
        </Typography>
        <TextField value={text} onChange={e => setText(e.target.value)} fullWidth multiline rows={3} rowsMax={10} />
        <Button disabled={text === origin} onClick={send}>
          수정
        </Button>
      </Popover>
    </>
  );
}

function StudentInfo({ reload, studentID, studentName, studentBirthday, studentGender, studentPhone, studentEmail, studentAddress, studentUniqueness }) {
/* @codingjoa
   학생 정보를 1줄 출력하는 컴포넌트
*/
  return (
    <>
      <TableCell>
        {studentID}
      </TableCell>
      <TableCell>
        {studentName}
      </TableCell>
      <TableCell>
        {studentBirthday && TimeString(studentBirthday, true)}
        {studentBirthday && `(만 ${CurrentAge(studentBirthday)}세)`}
      </TableCell>
      <TableCell>
        {studentGender}
      </TableCell>
      <TableCell>
        {studentPhone}
      </TableCell>
      <TableCell>
        {studentEmail}
      </TableCell>
      <TableCell>
        {studentAddress}
      </TableCell>
      <TableCell>
        <StudentUniqueness stid={studentID} studentUniqueness={studentUniqueness} reload={reload} />
      </TableCell>
      <TableCell>
        <Grid container>
          <Grid item xs={6}>
            수정
          </Grid>
          <Grid item xs={6}>
            삭제
          </Grid>
        </Grid>
      </TableCell>
    </>
  );
}

function StudentCreate({ qid, reload }) {
  const ni = useRef(null);
  const bi = useRef(null);
  const gi = useRef(null);
  const pi = useRef(null);
  const ei = useRef(null);
  const ai = useRef(null);
  const [ value, setValue ] = useState('0');

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'demoPopover',
  });
  const trying = useCallback(() => {
    const [ name, birthday, gender, phone, email, address ] = [
      ni.current?.value,
      bi.current?.value,
      gi.current?.value,
      pi.current?.value,
      ei.current?.value,
      ai.current?.value
    ];/*
    axios.post('/api/db/student', { qid, name, birthday, gender, phone, email, address })
    .then(r => {
      reload();
      popupState.setAnchorEl(null);
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`생성 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
*/
alert(name);
alert(birthday);
alert(gender);
alert(phone);
alert(email);
alert(address);
  }, []);

  return (
    <div>
      <Button onClick={trying} color="primary" variant="contained" {...bindTrigger(popupState)}>
        학생 추가
      </Button>
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
        <Typography color="primary" variant="h6">새로운 학생 추가</Typography>
        <TextField fullWidth inputRef={ni} type="text" label="이름" />
        <TextField fullWidth inputRef={bi} type="date" label="생년월일" />
        <FormControl component="fieldset">
          <FormLabel component="legend">성별</FormLabel>
          <RadioGroup aria-label="gender" name="gender1" inputRef={gi} value={value} onChange={e => setValue(e.target.value)}>
            <FormControlLabel value="0" control={<Radio />} label="여자" />
            <FormControlLabel value="1" control={<Radio />} label="남자" />
          </RadioGroup>
        </FormControl>
        <TextField fullWidth inputRef={pi} type="text" label="전화번호" />
        <TextField fullWidth inputRef={ei} type="email" label="이메일" />
        <TextField fullWidth inputRef={ai} type="text" label="주소" />
        <Button
          style={{ textAlign: 'center' }}
          variant="contained" 
          onClick={trying}
        >
          학생 추가
        </Button>
      </Popover>
    </div>
  );
}

function StudentDelete() {}

function StudentModify() {}

export default function Quarters() {
  const [ students, setStudents ] = useState(null);
  const [ qid, setQuarter ] = useState(0);
  const [ orderby, setOrderby ] = useState(null);
  const [ searchKeyword, setSearchKeyword ] = useState('');
  const [ quarters, setQuarters ] = useState(null);

  const fetchQuarters = useCallback(want => {
    axios.get(`/api/db/quarter`)
    .then(r => {
      setQuarters(r.data.fetchedData);
      setQuarter(want ?? r.data.fetchedData[0].quarterID);
    })
    .catch(e => {
      e.response?.status===400 && alert(`오류: ${e.response.data.cause}`);
      e.response?.status===404 && alert('조회된 데이터 없음.');
      if(e.response?.status===404) setQuarters([]);
      else setQuarters(false);
    });
  }, []);

  useLayoutEffect(() => {
    if(quarters !== null) return;
    fetchQuarters();
  }, []);

  const selectQuarter = useCallback(want => {
    const defaultID = !quarters ? 0 : quarters[0].quarterID;
    if(typeof want==='number') setQuarter(want);
    else setQuarter(defaultID);
  }, [ quarters ]);
  const name = useMemo(() => {
    if(!quarters) return null;
    if(!(qid > 0)) return null;
    return quarters.find(r => r.quarterID === qid).quarterName
  }, [ qid ]);

  const reloadStudent = useCallback(() => setStudents(null), []);
  useLayoutEffect(() => {
    if(qid > 0) setStudents(null);
  }, [ qid ]);
  useLayoutEffect(() => {
    if(!(qid ?? false)) return;
    if(students !== null) return;
    axios.get(`/api/db/quarter/${qid}`)
    .then(r => setStudents(r.data.fetchedData))
    .catch(e => {
      e.response?.status===400 && alert(`오류: ${e.response.data.cause}`);
      setStudents(false);
    });
  }, [ qid, students ]);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={9}>
              <QuarterSelect
                qid={qid}
                quarters={quarters}
                selectQuarter={selectQuarter}
              />
            </Grid>
            <Grid item xs={1}>
              <QuarterCreate
                reload={fetchQuarters}
              />
            </Grid>
            <Grid item xs={1}>
              <QuarterEdit
                qid={qid}
                name={name}
                reload={fetchQuarters}
              />
            </Grid>
            <Grid item xs={1}>
              <QuarterDelete
                qid={qid}
                name={name}
                reload={fetchQuarters}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <StudentCreate qid={qid} reload={reloadStudent}/>
        </Grid>
        <Grid item xs={6}>
          <OrderBy
            orderby={orderby}
            setOrderby={setOrderby}
            orderList={[
              { key: 'studentID', visualName: '번호'},
              { key: 'studentName', visualName: '이름'}
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Search setSearchKeyword={setSearchKeyword} />
        </Grid>
      </Grid>
      <SortedTable
        style={{ minWidth: '800px' }}
        Info={StudentInfo}
        fieldNames={ [
          '번호',
          '이름',
          '생일',
          '성별',
          '전화번호',
          '이메일',
          '집주소',
          '특이사항',
          '수정/삭제'
        ] }
        axiosResult={students}
        orderby={orderby}
        searchKeyword={searchKeyword}
        searchColumn={'studentName'}
        reload={reloadStudent}
      />
    </>
  );
}

