import React, { useState, useCallback } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './TeacherDelete';

import axios from 'axios';

export default function Teacher (props) {
  const [ datas, setDatas ] = useState(null);
  const Refresh = useCallback(sid => {
    setDatas(null);
  }, []);
  if(!datas) {
    axios.get('/api/db/teacher').then(r => r.data).then(setDatas);
    return (
      <>자료를 다시 불러오는 중...</>
    );
  }
  return (
    <>
      {datas.data.map(row =>
      <TableRow style={{textAlign:"center"}}>
        <TableCell style={{textAlign:"center"}}>{row.teacherID}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.teacherName}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.teacherOp}</TableCell>
        <TableCell style={{textAlign:"center"}}><TeacherDelete id={row.tid} refresh={Refresh}/></TableCell>
      </TableRow>
      )}
    </>
  );
}
