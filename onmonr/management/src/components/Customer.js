import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './CustomerDelete';
class Customer extends React.Component{
    render(){
        return(
            <TableRow>
                <TableCell></TableCell>
                <TableCell>{this.props.id}</TableCell>
                <TableCell><img src={this.props.image} alt="profile" style={{width:64 ,height: 64}} /></TableCell>
                <TableCell>{this.props.class}</TableCell>
                <TableCell>{this.props.name}</TableCell>
                <TableCell>{this.props.age}</TableCell>
                <TableCell>{this.props.birthday}</TableCell>
                <TableCell>{this.props.gender}</TableCell>
                <TableCell>{this.props.phone}</TableCell>
                <TableCell>{this.props.email}</TableCell>
                <TableCell>{this.props.address}</TableCell>
                <TableCell>{this.props.uniqueness}</TableCell>
                <TableCell><CustomerDelete stateRefresh = {this.props.stateRefresh} id = {this.props.id}/></TableCell>
            </TableRow>
        );
    }
}
export default Customer;
