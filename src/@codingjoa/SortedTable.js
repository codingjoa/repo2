import React, { useState, useCallback, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  }
}));

const state100 = Symbol('불러오는 중');
const state101 = Symbol('작업 실패');
const state200 = Symbol('작업 성공');
const state201 = Symbol('데이터 있음');

function FieldNames({ fieldNames }) {
/* @codingjoa
   필드 이름들을 1줄 출력하는 컴포넌트
*/
  return (
    <>
      <TableRow>
        {fieldNames.map(x => <TableCell>{x}</TableCell>)}
      </TableRow>
    </>
  );
}

export default function SortedTable({ Info, fieldNames, axiosResult, orderby, searchKeyword, searchColumn, reload }) {
/* @codingjoa
   학생 목록을 정렬해서 출력하는 컴포넌트
*/
  const classes = useStyles();

  const copied = useMemo(() => {
    if(!axiosResult) return null;
    return axiosResult.map(r => r);
  }, [ axiosResult ])
  const filtered = useMemo(() => {
    if(copied === null) return;
    if(orderby === null) return;
    const rg = new RegExp(searchKeyword ?? '', 'gi');
    return copied.filter(x => rg.test(x[searchColumn]) );
  }, [ searchKeyword, orderby, copied ]);
  const ordered = useMemo(() => {
    if(!filtered) return;
    const order = /^(.{3,4})\/(.{1,20})/.exec(orderby);
    filtered.sort((a, b) => (a[order[2]] > b[order[2]]) ? 1 : (a[order[2]] < b[order[2]]) ? -1 : 0);
    if(order[1] === 'asc') {
      return filtered;
    }
    else if(order[1] === 'desc')
      return filtered.reverse();
  }, [ filtered ]);
  const message = useMemo(() => {
    if(axiosResult === null) return '불러오는 중...';
    if(axiosResult === false) return '조회 실패.';
    if(!ordered) return '자료 정리중...';
    return null;
  }, [ axiosResult ]);
  
  if(message) {
    return (<>{message}</>);
  }
  
  return (
    <Paper className={classes.paper}>
      <Table>
        <TableHead>
          <FieldNames
            fieldNames={ fieldNames }
          />
        </TableHead>
        <TableBody>
          {ordered.map(row => 
            <TableRow>
              <Info
                {...row}
                reload={reload}
              />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
