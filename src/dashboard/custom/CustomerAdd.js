import React, { useState, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {withStyles} from '@material-ui/core/styles';

import { useForm } from 'react-hook-form';


const styles = theme => ({
    hidden: {
        display:'none'
    }
});


/*
  this.addCustomer()
            .then((response) =>{
                console.log(response.date);
                this.props.stateRefresh();
            })
  // state를 초기화
        
    handleFileChange =(e) =>{
        this.setState({
            file: e.target.files[0],
            fileName: e.target.value
        });
    }


        formData.append('classes',this.state.classes);
        formData.append('name',this.state.userName);
        formData.append('age',this.state.age);
        formData.append('birthday',this.state.birthday);
        formData.append('gender',this.state.gender);
        formData.append('phone',this.state.phone);
        formData.append('email',this.state.email);
        formData.append('address',this.state.address);
        formData.append('uniqueness',this.state.uniqueness);
        return post(url, formData, config);
    }

    //출석체크 부분
    CustomersCheck = () =>{

분기id를 보고 오늘 저장할 수 있는지 확인
출석체크: 학생id, 분기id, 선생id(session)




*/


export default function CustomerAdd() {
  //const {classes} = this.props;
  const [ open, setOpen ] = useState(false);
  const idi = useRef();
  const i = useRef();
  

  return(
    <div>
      <Button style={{margin:"15px 10px"}} variant="contained" color="primary" onClick={() => setOpen(true)} >
        학생추가
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} >
        <DialogTitle>학생 추가</DialogTitle>
        <DialogContent>
          <TextField label="반" type="text" name="classes" /><br/>
          <TextField label="이름" type="text" name="userName" /><br/>
          <TextField label="생년월일" type="date" name="birthday" fullWidth /><br/>
<Select label="성별" id="select" value="f" fullWidth> <MenuItem value="f">여</MenuItem> <MenuItem value="m">남</MenuItem> </Select><br/>
          <TextField label="성별" type="text" name="gender" /><br/>
          <TextField label="핸드폰번호" type="text" name="phone" /><br/>
          <TextField label="이메일" type="text" name="email" /><br/>
          <TextField label="주소" type="text" name="address" /><br/>
          <TextField label="특이사항" type="text" name="uniqueness" /><br/>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" >추가</Button>
          <Button variant="contained" color="primary" onClick={() => setOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
      <Button style={{margin:"15px 0"}} variant="contained" color="primary" onClick={() => setOpen(false)} >
        출석체크
      </Button>
    </div>
  );
}
