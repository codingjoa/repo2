import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Input from '@material-ui/core/Input';

function TimeString(origin) {
/* @codingjoa
   2020-08-12T12:08:34 형태의 시간을
   한국어로 바꿔주는 코드

   Quarters.js의 사본임
*/
  return new Date(Date.parse(origin)+32400000).toLocaleString('ko-KR', { timeZone: 'UTC' });
}

function today() {
  const DO = new Date();
  const today = /^([0-9]{4}-[0-9]{2}-[0-9]{2})/.exec( DO.toJSON() );

  return today;
}

function isTime(string) {
  return /^([0-9]{4}-[0-9]{2}-[0-9]{2})/.test(string);
}

function StudyFetch({ qid, setStudents }) {
  const [ date, setDate ] = useState(today());

  useLayoutEffect(() => {
    if(!isTime(date)) return;
    if(!qid) return;
    axios.get(`/api/db/study?qid=${qid}&date=${date}`)
    .then(r => r.data)
    .then(setStudents);
  }, [ date ]);

  return (
    <>
      <Input value={date} type="date" onChange={e => setDate(e.target.value)} />
    </>
  );
  
  
}



function StudentCheck() {
  
}

function StudentInfo({ name, modifiedAt }) {
  
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
  return (
    <>
      <TableRow>
        {fields.map(x => <TableCell>{x}</TableCell>)}
      </TableRow>
    </>
  );
}

function SortedList({ students }) {

  if(students === null) {
    return (<>불러오는 중...</>)
  }
  if(students?.complete === false) {
    alert(`${students.message}: ${students.cause}`);
    return (<>조회 실패</>);
  }
  return (
    <>
      <Table>
        <TableHead>
          <FieldNames
            fields={ ['이름', '승인 시간'] }
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
  
  return (
    <>
      <StudyFetch qid={5} setStudents={setStudents} />
      <SortedList students={students} />
    </>
  );
}
