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
import { useParams } from 'react-router-dom';
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

function StudyFetch({ date, setDate }) {
/* @codingjoa
   해당 반의 선택한 날짜의 출석부를 조사하여
   setStudents로 넘김

   결과가 없으면 없다고 알리되 오늘날짜라면
   출석부를 새로 만들어야 한다고 알림
*/
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

const HookCheckBox = createContext(null);

function StudentInfo({ id, name, modifiedAt }) {
/* @codingjoa
   학생 정보를 1줄 출력하는 컴포넌트
*/
  const { checked, setChecked } = useContext(HookCheckBox);
  if(checked[id] === undefined) return (<></>);
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

function SortedList({ students }) {
/* @codingjoa
   학생 목록을 정렬해서 출력하는 컴포넌트
*/
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
            fields={ ['이름', '승인/취소 시간', '출석 여부'] }
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
  const { quarterID, lessonMonth, weekNum } = useParams();
  
  const [ students, setStudents ] = useState(null);

  const [ checked, setChecked ] = useState({});
  const [ original, setOriginal ] = useState(checked);
  const [ record, setRecord ] = useState({});
  const statistics = useMemo(() => {
/* 배열이 크면 효율이 좀 떨어질 것임 */
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
      !(original[index] === checked[index]) && ( 재기록대상[데베재기록++] = index );
    }
    let 결석 = 총원 - 출석;
    return { 총원, 출석, 재승인, 취소, 결석, 재기록대상, 데베재기록 };
  }, [ checked ]);

  useLayoutEffect(() => {
    if(students !== null) return;
    axios.get(`/api/teacher/lesson/${quarterID}/${lessonMonth}/study/${weekNum}`)
    .then(r => setStudents(r.data.fetchedData))
    .catch(e => {
      if(e.response.status === 400 && !alert(`오류: ${e.response.data.cause}`)) return;
      alert(e);
      setStudents(false);
    });
  }, [ students]);
  useLayoutEffect(() => {
    //if(!students) return;
    setChecked({});
    setOriginal({});
    setRecord({});
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

  const cb = useCallback(() => {
    const r = window.confirm(`총원 ${statistics.총원}명 중, 출석${statistics.출석}명 결석${statistics.결석}명으로 처리하시겠습니까?`);
    axios.patch(`/api/teacher/lesson/${quarterID}/${lessonMonth}/study/${weekNum}`, { targets: statistics.재기록대상 })
    .then(r => {
      setStudents(null);
    })
    .catch(e => {
      if(e.response?.status===400 && !alert(`변경 실패: ${e.response.data.cause}`)) return;
      alert(e);
    });
  }, [ statistics ]);

  return (
    <HookCheckBox.Provider value={{ checked, setChecked, original, setOriginal, record, setRecord }}>
      <SortedList students={students} />
      <br />
      <Grid container spacing={3} style={{ maxWidth: '600px' }}>
        <Grid item>
          <Button variant="contained" onClick={cb} disabled={!statistics.데베재기록}>출석/결석 처리</Button>
        </Grid>
        <Grid item>
          총원: {statistics.총원}
        </Grid>
        <Grid item>
          출석: {statistics.출석}
        </Grid>
        <Grid item>
          재승인:{statistics.재승인}
        </Grid>
        <Grid item>
          취소: {statistics.취소}
        </Grid>
        <Grid item>
          변경됨: {statistics.데베재기록}
        </Grid>
      </Grid>
    </HookCheckBox.Provider>
  );
}
