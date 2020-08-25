import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './CustomerDelete';

const checkStyle = {
  textAlign:"center",
}
class Customer extends React.Component{

    render(){
        return(
            <TableRow style={checkStyle}>
                <TableCell style={checkStyle}>{this.props.sid}</TableCell>
                <TableCell style={checkStyle}>{this.props.qid}</TableCell>
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
