import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class StudentCheck extends React.Component{
  const checkStyle = {
    textAlign:"center",
    boxShadow:"3px 3px 5px #dddddd",
    position:'absolute',
    Top:'50%',
    left:'50%',
    transform:"transitions(-50%,-50%)",
    
}

    render(){
        return(
            <TableRow style={checkStyle}>
                <TableCell>{this.props.cid}</TableCell>
                <TableCell>{this.props.sid}</TableCell>
                <TableCell>{this.props.qid}</TableCell>
                <TableCell>{this.props.tid}</TableCell>
                <TableCell>{this.props.name}</TableCell>
                <TableCell>{this.props.date_time}</TableCell>
            </TableRow>
        );
    }
}
export default StudentCheck;
