import React, { useState, useEffect, useCallback } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './CustomerDelete';

import axios from 'axios';

export default function Customer (props) {
  const [ datas, setDatas ] = useState(null);
  const Remover = useCallback(id => {
    axios.delete(`/api/db/${id}`).then(() => null).then(setDatas);
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
      <TableCell style={{textAlign:"center"}}>{row.id}</TableCell>
      <TableCell style={{textAlign:"center"}}><img src={row.image} alt="profile" style={{width:64 ,height: 64}} /></TableCell>
      <TableCell style={{textAlign:"center"}}>{row.classes}</TableCell>
      <TableCell style={{textAlign:"center"}}>{row.name}</TableCell>
      <TableCell style={{textAlign:"center"}}>{row.age}</TableCell>
      <TableCell style={{textAlign:"center"}}>{row.birthday}</TableCell>
      <TableCell style={{textAlign:"center"}}>{row.gender}</TableCell>
      <TableCell style={{textAlign:"center"}}>{row.phone}</TableCell>
      <TableCell style={{textAlign:"center"}}>{row.email}</TableCell>
      <TableCell style={{textAlign:"center"}}>{row.address}</TableCell>
      <TableCell style={{textAlign:"center"}}>{row.uniqueness}</TableCell>
      <TableCell style={{textAlign:"center"}}><CustomerDelete id={row.id} Remover={Remover}/></TableCell>
    </TableRow>
      )}
    </>
  );
}
