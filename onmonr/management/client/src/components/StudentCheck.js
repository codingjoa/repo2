import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const checkStyle = {
  textAlign:"center"

}
class StudentCheck extends React.Component{
  constructor(props){
      super(props);
      this.state ={
          open:'',
          value:''
      }
  }
    componentDidMount(){

      }

      handleClose = () =>{
          this.setState({
              open:false
          });
      }
    render(){
        return(
            <TableRow style={checkStyle}>
                <TableCell style={checkStyle}>{this.props.cid}</TableCell>
                <TableCell style={checkStyle}>{this.props.sid}</TableCell>
                <TableCell style={checkStyle}>{this.props.qid}</TableCell>
                <TableCell style={checkStyle}>{this.props.tid}</TableCell>
                <TableCell style={checkStyle}>{this.props.name}</TableCell>
                <TableCell style={checkStyle}>{this.props.date_time}</TableCell>
            </TableRow>
            <Button variant="contained" color="primary" onClick={this.handleClose}>닫기</Button>
        );
    }
}
export default StudentCheck;
