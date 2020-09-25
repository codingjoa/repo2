import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class CustomerDelete extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            open:false,
            value:''
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


    deleteCustomer(sid){
        const url = '/customers/' + sid;
        fetch(url, {
            method:'DELETE'
        });
        this.props.stateRefresh();
    }

    checkCustomer(sid){
        const url = '/studentcheck/' + sid;
        fetch(url, {
            method:'POST'
        });
        this.props.stateRefresh();
    }

    render(){
        return(
        <div>
            <Button variant="contained" color="secondary" onClick={(e)=>{this.checkCustomer(this.props.sid)}}>출석</Button>
            <Button variant="contained" color="secondary" onClick={this.handleClickOpen}>삭제</Button>
            <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle onClose={this.handleClose}>
                    삭제 경고
                </DialogTitle>
                <DialogContent gutterBottom>
                    <Typography>
                    선택한 고객 정보가 삭제됩니다.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={(e)=>{this.deleteCustomer(this.props.sid)}}>삭제</Button>
                    <Button variant="contained" color="primary" onClick={this.handleClose}>닫기</Button>
                </DialogActions>
            </Dialog>
        </div>
        )
    }
}

export default CustomerDelete;
