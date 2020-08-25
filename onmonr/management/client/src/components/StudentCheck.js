import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const checkStyle = {
  textAlign:"center"

}

class StudentCheck extends React.Component{

    render(){
        return(
            <TableRow style={checkStyle}>
                <TableCell style={checkStyle}>{this.props.cid}</TableCell>
                <TableCell style={checkStyle}>{this.props.sid}</TableCell>
                <TableCell style={checkStyle}>{this.props.qid}</TableCell>
                <TableCell style={checkStyle}>{this.props.tid}</TableCell>
                <TableCell style={checkStyle}>{this.props.name}</TableCell>
                <TableCell style={checkStyle}>Date.parse({this.props.date_time})</TableCell>
            </TableRow>
        );
    }
}
export default StudentCheck;
