
import React, { useState, useReducer, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';

import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import EnhancedTable from '../Templates/EnhancedTable';

const arr = [
  { id: 1 },
  { id: 3 },
  { id: 2 },
  { id: 4 },
  { id: 5 }
];


function Checker({ checkMap, Checking, id }) {
  useLayoutEffect(() => {
    Checking(id, true);
  }, []);

  return (
    <Checkbox
      checked={checkMap[id]}
      onChange={e => {
alert(checkMap[id]);
        Checking(id, !checkMap[id])
      }}
    />
  );
}

function SortedRows({ rows, orderBy, asc, checkMap, Checking }) {
  const [ sortedRows, Sorting ] = useState(null);
  useLayoutEffect(() => {
    if(asc)
      Sorting(rows.sort((a, b) => a.id - b.id));
    else
      Sorting(rows.sort((a, b) => b.id - a.id));
  }, [orderBy, asc]);

// 앙 체크박스띠

  if(sortedRows === null) return (<></>);
  return (
    <>
      {sortedRows.map(row => 
        <TableRow>
          <TableCell><Checker checkMap={checkMap} Checking={Checking} id={row.id} /></TableCell>
          <TableCell>{row.id}</TableCell>
        </TableRow>
      )}
    </>
  );

}


function MyTable() {

  const [ checkMap, setCheckMap ] = useState([]);
  const Checking = useCallback((id, state) => {
    checkMap[id] = state;
    setCheckMap(checkMap);
  }, [checkMap]);
  const CheckingAll = useCallback(() => {
    const echo = checkMap.map(v => true);
    setCheckMap(echo);
  });

  return (
    <>
      <Checkbox onClick={CheckingAll} />
      <TableContainer>
        <Table>
          
          <TableBody>
            <SortedRows rows={arr} asc={false} checkMap={checkMap} Checking={Checking} />
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination />
    </>
  );
}

export default function TestCompoments({ fields, values }) {
  
  return (
    <>
      <EnhancedTable />
      <MyTable />
    </>
  );

/*
  //const cellList = [<input type="checkbox" ></input>,"번호","프로필 이미지", "반", "이름","나이", "생년월일", "성별", "핸드폰", "이메일", "주소", "특이사항", "설정"];
  return (<>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><Checkbox checked={all} onClick={selectAll} disabled/></TableCell>
          {fields.map(name =>
            <TableCell className={classes.tableHead}>{name}</TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody className={classes.tableBody}>
        {values.map((value, i) => 
          <TableRow>
            <TableCell><List key={i} checks={checks} dispatch={dispatch} /></TableCell>
            {value.map(v =>
              <TableCell>{v}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  </>);
*/
};
