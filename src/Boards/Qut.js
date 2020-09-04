import React, { useState, useCallback } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './CustomerDelete';

import axios from 'axios';

export default function Customer (props) {
  const [ datas, setDatas ] = useState(null);
  const Refresh = useCallback(sid => {
    setDatas(null);
  }, []);
  if(!datas) {
    axios.get('/api/db/quarter').then(r => r.data).then(setDatas);
    return (
      <>자료를 다시 불러오는 중...</>
    );
  }
  //<a href={'/url/' + row.sid}
  return (
    <>
      {datas.data.map(row =>
      <TableRow style={{textAlign:"center"}}>
        <TableCell style={{textAlign:"center"}}>{row.teacherID}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.quarterID}</TableCell>
        <TableCell style={{textAlign:"center"}}>{row.quarterName}</TableCell>
      </TableRow>
      )}
    </>
  );
}
