import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect
} from 'react';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

import Button from '@material-ui/core/Button';

const DO = new Date();

function TimeString(origin) {
/* @codingjoa
   2020-08-12T12:08:34 형태의 시간을
   한국어로 바꿔주는 코드

   Quarters.js의 사본임
*/
  return new Date(Date.parse(origin)+32400000).toLocaleString('ko-KR', { timeZone: 'UTC' });
}

function today() {
  const today = /^([0-9]{4}-[0-9]{2}-[0-9]{2})/.exec( DO.toJSON() );
  return today;
}

function isToday(string) {
  return today()[0] === string;
}

function isTime(string) {
  return /^([0-9]{4}-[0-9]{2}-[0-9]{2})/.test(string);
}

function StudyFetch({ qid, students, setStudents }) {
/* @codingjoa
   해당 반의 선택한 날짜의 출석부를 조사하여
   setStudents로 넘김

   결과가 없으면 없다고 알리되 오늘날짜라면
   출석부를 새로 만들어야 한다고 알림
*/
  const [ date, setDate ] = useState(today()[0]);
  const { setRecord, setOriginal, setChecked } = useContext(HookCheckBox);

  const fetch = useCallback(() => {
    if(!qid) return;
    if(!isTime(date)) return;
    axios.get(`/api/db/study?qid=${qid}&date=${date}`)
    .then(r => setStudents(r.data.fetchedData))
    .catch(e => {
      if(e.response.status === 400 && !alert(`오류: ${e.data.cause}`)) return;
      if(e.response.status === 404 && isToday(date) && !newStudy()) return;
      alert(e);
      setStudents(false);
    });
  }, [ qid, date ]);
  const newStudy = useCallback(() => {
    const ok = window.confirm('오늘자 출석부를 새로 만드시겠습니까?');
    if(!ok) return;
    axios.post('/api/db/study', { qid, date })
    .then(r => {
      fetch();
    })
    .catch(e => {
      if(e.response.state === 400 && !alert(`오류: ${e.data.cause}`)) return;
      alert(e);
    });
  }, [ qid, date ]);

  useLayoutEffect(() => {
    fetch();
  }, [ qid, date ]);

  useLayoutEffect(() => {
    if(!students) return;
    const newChecked = {};
    for(const row of students) {
      newChecked[row.studentID] = row.checkOk===1;
    }
    setChecked(newChecked);
    setOriginal(newChecked);
    const newRecords = {};
    for(const row of students) {
      newRecords[row.studentID] = row.checkModified;
    }
    setRecord(newRecords);
  }, [ students ]);

  return (
    <>
      <Input value={date} type="date" onChange={e => setDate(e.target.value)} />
    </>
  );
  
  
}

function QuarterSelect({ qid, setQuarter }) {
/* @codingjoa
   반을 선택하는 컴포넌트
   1. 반 목록을 불러옴(1회만)
   2. 
*/
  const [ quarters, setQuarters ] = useState(null);

  useLayoutEffect(() => {
    axios.get('/api/db/quarter')
    .then(r => setQuarters(r.data.fetchedData))
    .catch(e => {
      if(e.response.state === 400 && !alert(`오류: ${e.data.cause}`)) return;
      alert(e);
    });
  }, []);

  return (
    <>
      <Select value={qid ?? 0} onChange={e => setQuarter(e.target.value)}>
        <MenuItem value={0}>반 선택</MenuItem>
        {quarters && quarters.map(row => 
          <MenuItem value={row.quarterID}>{row.quarterName}</MenuItem>
        )}
      </Select>
    </>
  );
}

function StudentCheck({ id }) {
  
}

const HookCheckBox = createContext(null);

function StudentInfo({ id, name, modifiedAt }) {
/* @codingjoa
   학생 정보를 1줄 출력하는 컴포넌트
*/
  const { checked, setChecked } = useContext(HookCheckBox);
  return (
    <>
      <TableCell>
        {name}
      </TableCell>
      <TableCell>
        {TimeString(modifiedAt)}
      </TableCell>
      <TableCell>
        <Checkbox
          checked={checked[id]}
          onChange={e => {
            const copy = {...checked}
            copy[id] = !checked[id];
            setChecked(copy);
          }}
        />
      </TableCell>
    </>
  );
}

function FieldNames({ fields }) {
/* @codingjoa
   필드 이름들을 1줄 출력하는 컴포넌트
*/
  return (
    <>
      <TableRow>
        {fields.map(x => <TableCell>{x}</TableCell>)}
      </TableRow>
    </>
  );
}

function SortedList({ qid, students }) {
/* @codingjoa
   학생 목록을 정렬해서 출력하는 컴포넌트
*/
  if(qid === 0) {
    return (<>검색할 반을 선택하세요.</>);
  }
  if(students === null) {
    return (<>불러오는 중...</>);
  }
  if(students === false) {
    return (<>조회 실패</>);
  }
  return (
    <>
      <Table>
        <TableHead>
          <FieldNames
            fields={ ['이름', '승인/취소 시간'] }
          />
        </TableHead>
        <TableBody>
          {students.map(row => 
            <TableRow>
              <StudentInfo 
                id={row.studentID}
                name={row.studentName}
                modifiedAt={row.checkModified}
              />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default function Study() {
  const [ students, setStudents ] = useState(null);
  const [ qid, setQuarter ] = useState(0);
  const [ checked, setChecked ] = useState({});
  const [ original, setOriginal ] = useState(checked);
  const [ record, setRecord ] = useState({});


  const cb = useCallback(() => {
    let 총원 = 0;
    let 출석 = 0;
    let 재승인 = 0;
    let 취소 = 0;
    let 데베재기록 = 0;
    const 재기록대상=[];
    for(const index in original) {
      총원++;
      checked[index] && 출석++;
      !original[index] && record[index] && checked[index] && 재승인++;
      original[index] && record[index] && !checked[index] && 취소++;
      !(original[index] === checked[index]) && ( 재기록대상[데베재기록++] = { id: index, checked: checked[index] } );
    }
    let 결석 = 총원 - 출석;
    alert(`총원 ${총원}명, 출석${출석}명(재승인 ${재승인}명) 결석${결석}명(취소 ${취소}명) 재기록 대상 ${데베재기록}명`);
alert(재기록대상.length);
  }, [ original, checked, record ]);

  return (
    <HookCheckBox.Provider value={{ checked, setChecked, original, setOriginal, record, setRecord }}>
      <Grid container>
        <Grid item xs={6}>
          <StudyFetch qid={qid} students={students} setStudents={setStudents} />
        </Grid>
        <Grid item xs={6}>
          <QuarterSelect qid={qid} setQuarter={setQuarter} />
        </Grid>
      </Grid>
      <SortedList qid={qid} students={students} />
<Button onClick={cb}>실험</Button>
    </HookCheckBox.Provider>
  );
}
