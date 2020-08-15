import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './CustomerDelete';
class Customer extends React.Component{
    render(){
        return(
            <TableRow style={{textAlign:"center"}}>
                <TableCell style={{textAlign:"center"}}></TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.id}</TableCell>
                <TableCell style={{textAlign:"center"}}><img src={this.props.image} alt="profile" style={{width:64 ,height: 64}} /></TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.classes}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.name}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.age}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.birthday}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.gender}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.phone}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.email}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.address}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.uniqueness}</TableCell>
                <TableCell style={{textAlign:"center"}}><CustomerDelete stateRefresh = {this.props.stateRefresh} id = {this.props.id}/></TableCell>
            </TableRow>
        );
    }
}
export default Customer;
