import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class StudentCheck extends React.Component{
    render(){
        return(
            <TableRow style={{textAlign:"center"}}>
                <TableCell style={{textAlign:"center"}}>{this.props.cid}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.sid}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.qid}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.tid}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.name}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.date_time}</TableCell>
            </TableRow>
        );
    }
}
export default Student_check;
