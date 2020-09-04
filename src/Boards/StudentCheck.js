import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import axios from 'axios';

const checkStyle = {
  textAlign:"center"

}

function TimeString(origin) {
  return new Date(Date.parse(origin)).toString();
}

export default function StudentCheck (props) {
    // checkCustomer(sid){
// axios.post(url, { sid, qid }
  //     const url = '/:sid';
  //     fetch(url, {
  //         method:'POST'
  //     });
  //

  // codingjoa@ 정보를 담는 state
  const [ datas, setDatas ] = useState(null);
  if(!datas) {
    // codingjoa@ studentCheck에 호출해야되는데 그거 아직 구현 안함
    axios.post('/api/studentCheck').then(r => r.data).then(setDatas);
    return null;
  };
  //학생 클릭 시 sid 값을 받아와서 학생 출력 정보를 출력한다.
  //<a href={row.sid} 이렇게는 안될 것 같은데.. 음
  return(
    <>
      {datas.map(row =>
        <TableRow style={checkStyle}>
          <TableCell style={checkStyle}>{row.cid}</TableCell>
          <TableCell style={checkStyle}>{row.sid}</TableCell>
          <TableCell style={checkStyle}>{row.qid}</TableCell>
          <TableCell style={checkStyle}>{row.tid}</TableCell>
          <TableCell style={checkStyle}>{row.name}</TableCell>
          <TableCell style={checkStyle}>{TimeString(row.date_time)}</TableCell>
        </TableRow>
      )}
    </>
  );
}
