import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './CustomerDelete';
class Customer extends React.Component{
  componentDidMount() {
  // Jquery here $(...)...
}


    render(){
        return(
            <TableRow style={{textAlign:"center"}}>
                <TableCell style={{textAlign:"center"}}>{this.props.sid}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.qid}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.name}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.age}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.birthday}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.gender}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.phone}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.email}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.address}</TableCell>
                <TableCell style={{textAlign:"center"}}>{this.props.uniqueness}</TableCell>
                <TableCell style={{textAlign:"center"}}><CustomerDelete stateRefresh = {this.props.stateRefresh} sid = {this.props.sid}/></TableCell>
            </TableRow>
        );
    }
}
export default Customer;
