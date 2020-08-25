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
                <TableCell style={checkStyle}>{this.props.name}</TableCell>
                <TableCell style={checkStyle}>{this.props.age}</TableCell>
                <TableCell style={checkStyle}>{this.props.birthday}</TableCell>
                <TableCell style={checkStyle}>{this.props.gender}</TableCell>
                <TableCell style={checkStyle}>{this.props.phone}</TableCell>
                <TableCell style={checkStyle}>{this.props.email}</TableCell>
                <TableCell style={checkStyle}>{this.props.address}</TableCell>
                <TableCell style={checkStyle}>{this.props.uniqueness}</TableCell>
                <TableCell style={checkStyle}><CustomerDelete stateRefresh = {this.props.stateRefresh} id = {this.props.sid}/></TableCell>
            </TableRow>
        );
    }
}
export default Customer;
