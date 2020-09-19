import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
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

  const fetch = useCallback(() => {
    if(!qid) return;
    if(!isTime(date)) return;
    axios.get(`/api/db/study?qid=${qid}&date=${date}`)
    .then(r => r.data)
    .then(setStudents);
  }, [ qid, date ]);
  const isCompleted = useCallback(protocol => {
    if(!protocol?.complete) {
      alert(`${protocol.message}: ${protocol.cause}`);
      return;
    }
    return true;
  }, []);
  const newStudy = useCallback(() => {
    const ok = window.confirm('오늘자 출석부를 새로 만드시겠습니까?');
    if(!ok) return;
    axios.post('/api/db/study', { qid, date })
    .then(r => r.data)
    .then(isCompleted)
    .then(x => {
      if(x) fetch();
    });
  }, [ qid, date ]);

  useEffect(() => {
    if(students === null) return;
    if(!students?.complete) {
      if(isToday(date)) {
        newStudy();
      }
      else {
        alert(`${students.message}: ${students.cause}`);
      }
    }
  }, [ students ]);
  useLayoutEffect(() => {
    fetch();
  }, [ qid, date ]);

  return (
    <>
      <Input value={date} type="date" onChange={e => setDate(e.target.value)} />
    </>
  );
  
  
}

function QuarterSelect({ qid, setQuarter }) {
/* @codingjoa
   반을 선택하는 컴포넌트
*/
  const [ quarters, setQuarters ] = useState(null);

  useLayoutEffect(() => {
    axios.get('/api/db/quarter')
    .then(r => r.data)
    .then(setQuarters);
  }, []);

  if(quarters === null) return (<></>);
  return (
    <>
      <Select value={qid ?? 0} onChange={e => setQuarter(e.target.value)}>
        <MenuItem value={0}>반 선택</MenuItem>
        {quarters.data.map(row => 
          <MenuItem value={row.quarterID}>{row.quarterName}</MenuItem>
        )}
      </Select>
    </>
  );
}




function StudentCheck() {
  
}

function StudentInfo({ name, modifiedAt }) {
/* @codingjoa
   학생 정보를 1줄 출력하는 컴포넌트
*/
  return (
    <>
      <TableCell>
        {name}
      </TableCell>
      <TableCell>
        {TimeString(modifiedAt)}
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
  if(students?.complete === false) {
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
          {students.data.map(row => 
            <TableRow>
              <StudentInfo 
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
  
  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <StudyFetch qid={qid} students={students} setStudents={setStudents} />
        </Grid>
        <Grid item xs={6}>
          <QuarterSelect qid={qid} setQuarter={setQuarter} />
        </Grid>
      </Grid>
      <SortedList qid={qid} students={students} />
    </>
  );
}
