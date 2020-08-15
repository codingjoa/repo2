import React from 'react';
import {post} from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import Customer from './Customer';

const styles = theme => ({
    hidden: {
        display:'none'
    }
});



class CustomerAdd extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            file:null,
            userName:'',
            age: '',
            brithday : '',
            gender :'',
            phone : '',
            email:'',
            address:'',
            uniqueness:'',
            fileName :'',
            open: false

        }
    }

    handleClickOpen = () =>{
        this.setState({
            open:true
        });
    }

    handleClose = () =>{
        this.setState({
          file:null,
          userName:'',
          age: '',
          brithday : '',
          gender :'',
          phone : '',
          email:'',
          address:'',
          uniqueness:'',
          fileName :'',
            open:false
        })
    }


    handleFormSubmit = (e) =>{
        e.preventDefault()
        this.addCustomer()
            .then((response) =>{
                console.log(response.date);
                this.props.stateRefresh();
            })
        this.setState({
          file:null,
          userName:'',
          age: '',
          brithday : '',
          gender :'',
          phone : '',
          email:'',
          address:'',
          uniqueness:'',
          fileName :'',
            open:false
        })
    }

    handleFileChange =(e) =>{
        this.setState({
            file: e.target.files[0],
            fileName: e.target.value
        });
    }
    //체인지
    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    addCustomer = () =>{
        const url ='/api/customers';
        const formData = new FormData();
        formData.append('image',this.state.file);
        formData.append('class',this.state.class);
        formData.append('name',this.state.userName);
        formData.append('age',this.state.age);
        formData.append('birthday',this.state.birthday);
        formData.append('gender',this.state.gender);
        formData.append('phone',this.state.phone);
        formData.append('email',this.state.email);
        formData.append('address',this.state.adress);
        formData.append('uniqueness',this.state.uniqueness);
        const config ={
            headers:{
                'content-type' : 'multipart/form-data'
            }
        }
        return post(url, formData, config);
    }

    //출석체크 부분
    CustomersCheck = () =>{
        const url ='/api/customer';
        const formData = new FormData();
        formData.append('name',this.state.userName);
        formData.append('birthday',this.state.birthday);
        formData.map()
        return post(url, formData);
    }

    handleCheck = (e) =>{
        e.preventDefault()
        this.CustomersCheck()
            .then((response) =>{
                console.log(response.date);
                this.props.stateRefresh();
            })
        alert('출석완료!');
    }

    render(){
        const {classes} = this.props;
        //checkbox
        return(
            <div>
                <Button style={{margin:"15px 10px"}} variant="contained" color="primary" onClick={this.handleClickOpen} >
                    학생추가
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose} >
                    <DialogTitle>학생 추가</DialogTitle>
                    <DialogContent>
                    <input className={classes.hidden} accept="image/*" id="raised-button-file" type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} /><br/>
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" color="primary" component="span" name="file">
                            {this.state.fileName === "" ? "프로필 이미지" : this.state.fileName}
                        </Button><br/>
                    </label>
                    <TextField label="반" type="text" name="class" value={this.state.class} onChange={this.handleValueChange}/><br/>
                    <TextField label="이름" type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange}/><br/>
                    <TextField label="나이" type="text" name="age" value={this.state.age} onChange={this.handleValueChange}/><br/>
                    <TextField label="생년월일" type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange} /><br/>
                    <TextField label="성별" type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}/><br/>
                    <TextField label="핸드폰번호" type="text" name="phone" value={this.state.phone} onChange={this.handleValueChange}/><br/>
                    <TextField label="이메일" type="text" name="email" value={this.state.email} onChange={this.handleValueChange}/><br/>
                    <TextField label="주소" type="text" name="address" value={this.state.address} onChange={this.handleValueChange}/><br/>
                    <TextField label="특이사항" type="text" name="uniqueness" value={this.state.uniqueness} onChange={this.handleValueChange}/><br/>
                    </DialogContent>
                    <DialogActions>
                    <Button variant="contained" color="primary" onClick={this.handleFormSubmit}>추가</Button>
                    <Button variant="contained" color="primary" onClick={this.handleClose}>닫기</Button>
                    </DialogActions>
                </Dialog>
                <Button style={{margin:"15px 0"}} variant="contained" color="primary" onClick={this.handleCheck} >
                    출석체크
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(CustomerAdd);
