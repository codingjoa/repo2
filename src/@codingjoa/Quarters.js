import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';

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

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';

import axios from 'axios';

function TimeString(origin) {
/* @codingjoa
   2020-08-12T12:08:34 형태의 시간을
   한국어로 바꿔주는 코드
*/
  return new Date(Date.parse(origin)).toLocaleString('ko-KR', { timeZone: 'UTC' });
}

function CurrentAge(origin) {
/* @codingjoa
   만 나이 계산 공식
   출처: https://m.blog.naver.com/PostView.nhn?blogId=wow0815&logNo=90178740921&proxyReferer=https:%2F%2Fwww.google.com%2F
*/
  const regexp = /^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})/;
  const birthday = regexp.exec(origin);
  const today = regexp.exec( new Date().toJSON() );
  const age = today[1] - 0 - birthday[1];
  if( today[2]-0 < birthday[2]-0 ) return age;
  if( today[2]-0 === birthday[2]-0) {
    if( today[3]-0 <= birthday[3]-0 ) {
      return age;
    }
  }
  return age - 1;
}

function Students({ select, quarters }) {
  const [ students, setStudents ] = useState(null);
  const [ filtered, setFiltered ] = useState(null);
  const keyword = useRef();
  const Search = useCallback(() => {
/* @codingjoa
   검색 버튼을 눌렀을 때
   keyword Ref의 current.value를 가져와
   원래 데이타 datas를 참고해서 새 데이터 filtered를 만듬
   RegExp(정규식)을 이용하기 때문에
   중간, 끝 문자 일치시에도 불러올 수 있어요.
*/
    const text = keyword.current?.value ?? '';
    const rg = new RegExp(text, 'gi');
    //setFiltered(students.data.filter(x => x.name.startsWith(text) ));
    setFiltered(students.data.filter(x => rg.test(x.studentName) ));
  }, [ students, keyword ]);

/* @codingjoa
   select가 변할 때마다
   students와 filtered는
   null이 되어 학생 목록을 없앱니다.
*/
  useEffect(() => {
    setStudents(null);
    setFiltered(null);
  }, [ select ]);
  if(select === null || quarters === null) {
    return (
      <></>
    );
  }
  else if(students === null){
/* @codingjoa
   첫 실행시 select가 선택이 되기 전과
   quarters가 다시 불러와지기 전까지
   학생 목록을 띄우는 것을 금지합니다.
*/
    axios.get(`/api/db/student?qid=${select}`)
    .then(r => r.data)
    .then(setStudents);
    return (
      <>학생 목록을 불러오는 중...</>
    );
  }
  else if(!students.complete) {
    return (
      <>학생 목록을 불러오는 데 실패했습니다.</>
    );
  }
  else if(!filtered) {
    Search();
    return (
      <>학생 목록을 필터링하는 중...</>
    );
  }

  return (
    <>
      <TextField label="검색" type="text" inputRef={keyword} name="search" /><br/>
      <Button variant="contained" color="primary" onClick={Search} endIcon={<SearchIcon />}>검색</Button>
<AddStudent select={select} setStudents={setStudents} setFiltered={setFiltered} />
<React.Fragment>
<Table style={{ minWidth: '800px' }}>
<TableHead>
      <TableRow style={{textAlign:"center"}}>
        <TableCell></TableCell>
        <TableCell>번호</TableCell>
        <TableCell>이름</TableCell>
        <TableCell>생일</TableCell>
        <TableCell>성별</TableCell>
        <TableCell>전화번호</TableCell>
        <TableCell>이메일</TableCell>
        <TableCell>집주소</TableCell>
        <TableCell>특이사항</TableCell>
        <TableCell>삭제</TableCell>
      </TableRow>
</TableHead>
<TableBody>
      {filtered.map(row =>
      <TableRow style={{textAlign:"center"}}>
        <TableCell style={{textAlign:"center"}}></TableCell>
        <TableCell style={{textAlign:"center"}}>{row.studentID}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.studentName}</TableCell>
        <TableCell style={{textAlign:"center"}}>{TimeString(row.studentBirthday)}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.studentGender}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.studentPhone}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.studentEmail}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.studentAddress}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.studentUniqueness}</TableCell>
        <TableCell style={{textAlign:"center"}}>
          <IconButton>
            <CheckIcon />
          </IconButton>
          <DeleteStudent sid={row.studentID} name={row.studentName} setStudents={setStudents} setFiltered={setFiltered} />
        </TableCell>
      </TableRow>
      )}
</TableBody>
</Table>
</React.Fragment>
      
    </>
  );

}

function Quarters({ quarters, select, setSelect, setQuarters }) {
  const editName = useCallback(() => {
/* @codingjoa
   변경할 이름을 입력시키는 창을 띄우는데
   quarters가 변경되거나 select가 변경될 때
   이 함수를 다시 만듭니다.
*/
    const find = quarters.data.find(m => m.quarterID === select);
    const name = prompt('변경할 이름을 입력', find.quarterName);
    if(name === null) return;
    axios.put('/api/db/quarter', { qid: select, qname: name })
    .then(r => setQuarters(null));
  }, [select, quarters]);

  if(quarters === null) {
    return (
      <>반 목록을 불러오는 중...</>
    );
  }
  else if(!quarters.complete) {
    return (
      <>반 목록을 불러오는 데 실패했습니다.</>
    );
  }
  return (
    <Grid container>
      <Grid container xs={6}>
        <Grid container item xs={10}>
          <Select style={{width: '100%'}} value={select} onChange={e => setSelect(e.target.value)}>
            {quarters.data.map(row => 
              <MenuItem value={row.quarterID}>{row.quarterName}</MenuItem>
            )}
          </Select>
        </Grid>
        <Grid container item xs={2}>
          <IconButton onClick={editName}>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container item xs={6}>
        <AddQuarter setQuarters={setQuarters} setSelect={setSelect} />
        {quarters.data.length}개 반 조회됨.
      </Grid>
    </Grid>
  );

}

function AddQuarter({ setQuarters, setSelect }) {

  const question = useCallback(() => {
    const r = window.confirm('새 반을 생성 할까요?');
    if(!r) return;
    axios.post('/api/db/quarter')
    .then(r => setSelect(r.data?.data))
    .then(() => setQuarters(null));
    
  }, []);
  
  return (
    <div>
      <Button onClick={question} color="primary" variant="contained">
        새로운 반 만들기
      </Button>
    </div>
  );
}

function AddStudent({ select, setStudents, setFiltered }) {
  const question = useCallback(() => {
    const r = window.prompt('학생 이름을 입력하세요.', '');
    if(!r) return;
    axios.post('/api/db/student', { qid: select, name: r })
    .then(() => {
      setStudents(null);
      setFiltered(null);
    });
    
  }, [ select ]);
  
  return (
    <div>
      <Button onClick={question} color="primary" variant="contained">
        학생 추가
      </Button>
    </div>
  );
}

function DeleteStudent({ sid, name, setStudents, setFiltered }) {
  const question = useCallback(() => {
    const r = window.confirm(`${name} 학생을 명부에서 삭제합니다.`);
    if(!r) return;
    axios.delete(`/api/db/student?sid=${sid}`)
    .then(() => {
      setStudents(null);
      setFiltered(null);
    });
  }, []);
  
  return (
    <div>
      <IconButton onClick={question} color="primary">
        <DeleteIcon />
      </IconButton>
    </div>
  );
  
}





export default function Customer (props) {
  const [ quarters, setQuarters ] = useState(null);
  const [ select, setSelect ] = useState(null);
/* @codingjoa
   datas: api에서 불러온 데이터를 저장하는 state
   filtered: 검색어를 이용해 필터링된 데이터를 저장하는 state
   keyword: TextField를 가리키기 위해 사용히는 ref
*/
  useEffect(() => {
    if(quarters === null) {
      axios.get('/api/db/quarter')
      .then(r => r.data)
      .then(setQuarters);
      return;
    }
    if(quarters?.data === null) return;
    if(select === null) setSelect(quarters.data[0].quarterID ?? null);
  }, [ quarters ]);

  return (
    <>
      <Quarters quarters={quarters} select={select} setSelect={setSelect} setQuarters={setQuarters} />
      <Students quarters={quarters} select={select} />
    </>
  );

}
