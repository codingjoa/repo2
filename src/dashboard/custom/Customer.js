import React, { useState, useEffect, useCallback } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './CustomerDelete';

import axios from 'axios';

export default function Customer (props) {
  const [ datas, setDatas ] = useState(null);
  const Remover = useCallback(sid => {
    axios.delete(`/api/db/${sid}`).then(() => null).then(setDatas);
  });
  if(!datas) {
    axios.get('/api/db').then(r => r.data).then(setDatas);
    return null;
  }
  return (
    <>
      {datas.map(row =>
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
      <TableCell style={{textAlign:"center"}}><CustomerDelete id={row.sid} Remover={Remover}/></TableCell>
    </TableRow>
      )}
    </>
  );
}
