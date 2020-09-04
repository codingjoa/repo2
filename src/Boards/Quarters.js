import React, { useState, useCallback, useRef } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';

import CustomerDelete from './CustomerDelete';

import axios from 'axios';

export default function Customer (props) {
  const [ quarters, setQuarters ] = useState(null);
  const getQuarters = useCallback(()=>{
    axios.get('/api/db/quarter').then(r => r.data).then(setQuarters);
  }, []);

  /* @codingjoa
   datas: api에서 불러온 데이터를 저장하는 state
   filtered: 검색어를 이용해 필터링된 데이터를 저장하는 state
   keyword: TextField를 가리키기 위해 사용히는 ref
*/
  const [ datas, setDatas ] = useState(null);
  const [ filtered, setFiltered ] = useState(null);
  const keyword = useRef();
  const Refresh = useCallback(sid => {
/* @codingjoa
   datas가 null로 변경됨에 따라 화면은 다시 렌더링 될 것이고.
   if문이 true가 되어 자료를 다시 불러오게 된다.
*/
    setDatas(null);
    setFiltered(null);
  }, []);
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
    //setFiltered(datas.filter(x => x.name.startsWith(text) ));
    setFiltered(datas.filter(x => rg.test(x.name) ));
  }, [ datas, keyword ]);


  if(quarters === null) {
    getQuarters();
    return (
      <>반 목록을 불러오는 중...</>
    );
  }
  else if(!quarters.complete) {
    return (
      <>반 목록을 불러오는 데 실패했습니다.</>
    );
  }
  else {
/* @codingjoa
   작업중입니다.


*/
  return (
    <>
      <Button onClick={() => { axios.get(`/api/db/${p}`)}}>
      {quarters.data.map(row =>
      <TableRow style={{textAlign:"center"}}>
        <TableCell style={{textAlign:"center"}}>{row.teacherID}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.quarterID}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.quarterName}</TableCell>
      </TableRow>
      )}
    </>
  );


  }


  if(!datas) {
/* @codingjoa
   처음 페이지를 불러왔을 때,
   Refresh 콜백으로 인해 datas가 null이 됐을 때
   실행됨으로써 자료를 다시 불러옴
*/
    axios.get('/api/db').then(r => r.data).then(setDatas);
    return (
      <>자료를 다시 불러오는 중...</>
    );
  }
  if(!filtered) {
    Search();
    return (
      <>자료를 필터링하는 중...</>
    );
  }
  return (
    <>
      <TextField label="검색" type="text" inputRef={keyword} name="search" /><br/>
      <Button variant="contained" color="primary" onClick={Search} endIcon={<SearchIcon />}>검색</Button>
<Table>
<TableHead>
      <TableRow style={{textAlign:"center"}}>
        <TableCell></TableCell>
        <TableCell>번호</TableCell>
        <TableCell>반 번호</TableCell>
        <TableCell>이름</TableCell>
        <TableCell>나이</TableCell>
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
        <TableCell style={{textAlign:"center"}}>{row.sid}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.qid}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.name}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.age}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.birthday}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.gender}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.phone}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.email}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.address}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.uniqueness}</TableCell>
        <TableCell style={{textAlign:"center"}}>
          { /* 삭제 버튼임 */ }
          <CustomerDelete id={row.sid} refresh={Refresh}/>
          <IconButton>
            <CheckIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      )}
</TableBody>
</Table>
      
    </>
  );
}
