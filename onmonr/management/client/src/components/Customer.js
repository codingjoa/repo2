import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './CustomerDelete';
class Customer extends React.Component{
  const checkStyle = {
    textAlign:"center",
}
    render(){
        return(
            <TableRow style={checkStyle}>
                <TableCell>{this.props.sid}</TableCell>
                <TableCell>{this.props.qid}</TableCell>
                <TableCell>{this.props.name}</TableCell>
                <TableCell>{this.props.age}</TableCell>
                <TableCell>{this.props.birthday}</TableCell>
                <TableCell>{this.props.gender}</TableCell>
                <TableCell>{this.props.phone}</TableCell>
                <TableCell>{this.props.email}</TableCell>
                <TableCell>{this.props.address}</TableCell>
                <TableCell>{this.props.uniqueness}</TableCell>
                <TableCell><CustomerDelete stateRefresh = {this.props.stateRefresh} sid = {this.props.sid}/></TableCell>
            </TableRow>
        );
    }
}
export default Customer;
