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
          open:false,
          value:'',
          date_time:''
      }
  }


  handleClickOpen = () =>{
      this.setState({
          open:true
      });
  }

  handleClose = () =>{
      this.setState({
          open:false
      });
  }
    render(){
        const t = Date.parse(this.props.date_time);
        const time = new Date(t);
        console.log(time.toString());

        return(
            <TableRow style={checkStyle}>
                <TableCell style={checkStyle}>{this.props.cid}</TableCell>
                <TableCell style={checkStyle}>{this.props.sid}</TableCell>
                <TableCell style={checkStyle}>{this.props.qid}</TableCell>
                <TableCell style={checkStyle}>{this.props.tid}</TableCell>
                <TableCell style={checkStyle}>{this.props.name}</TableCell>
                <TableCell style={checkStyle}>{this.timecheck}</TableCell>
            </TableRow>
        );
    }
}
export default StudentCheck;
