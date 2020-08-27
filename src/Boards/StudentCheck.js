import React, { useState, useEffect, useCallback } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import axios from 'axios';

const checkStyle = {
  textAlign:"center"

}
export default function StudentCheck (props) {

  const [ datas, setDatas ] = useState(null);
  if(!datas) {
    axios.get('/api/db').then(r => r.data).then(setDatas);
    return null;
  };
  // const t = Date.parse(row.props.date_time);
  // const time = new Date(t);
  // console.log(time.toString());
        return(
          <>
          {datas.map(row =>
            <TableRow style={checkStyle}>
                <TableCell style={checkStyle}>{row.cid}</TableCell>
                <TableCell style={checkStyle}>{row.sid}</TableCell>
                <TableCell style={checkStyle}>{row.qid}</TableCell>
                <TableCell style={checkStyle}>{row.tid}</TableCell>
                <TableCell style={checkStyle}>{row.name}</TableCell>
                <TableCell style={checkStyle}>{row.date_time}</TableCell>
            </TableRow>
            )}
            </>
        );
}
