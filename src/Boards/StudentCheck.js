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
  }
  componentDidMount(){
        const t = Date.parse(this.props.date_time);
        const time = new Date(t);
        console.log(time.toString());
  }
        return(
          <>
          {datas.map(row =>
            <TableRow style={checkStyle}>
                <TableCell style={checkStyle}>{this.props.cid}</TableCell>
                <TableCell style={checkStyle}>{this.props.sid}</TableCell>
                <TableCell style={checkStyle}>{this.props.qid}</TableCell>
                <TableCell style={checkStyle}>{this.props.tid}</TableCell>
                <TableCell style={checkStyle}>{this.props.name}</TableCell>
                <TableCell style={checkStyle}>{time.toString()}</TableCell>
            </TableRow>
            )}
            </>
        );

}
export default StudentCheck;
