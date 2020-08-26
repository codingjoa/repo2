import React, { Component } from 'react';
import CustomerAdd from './components/CustomerAdd';
import './App.css';
import Customer from './components/Customer';
import StudentCheck from './components/StudentCheck';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress'
import {withStyles} from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  root:{
    width:'100%',
    minWidth:1080
  },
  paper: {
    marginLeft: 18,
    marginRight: 18
  },
  progress: {
    margin: theme.spacing * 2,
    textAlign:"center"

  },
  grow:{
    flexGrow: 1,
  },
  tableBody:{textAlign:"center",width:'100%'},
  tableHead: {
    fontSize:'1.0rem',
    textAlign:"center"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  // 출석체크
  checkzul:{
    textAlign:"center",
    width:"80%",
    position:"absolute",
    top:"50%",
    left:"50%",
    transform:"translate(-50%,-50%)",
    zIndex:'1',
    fontSize:'1.0rem',

  },
  //클릭시 배경
  subback:{width:"100%",height:"100%",position:"absolute"},
  //선생
  teacher:{
    width:"50%",
  }
});

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      customers:'',
      studentcheck:'',
      completed:0,
      searchKeyword:''
    }
  }

  stateRefresh = () => {
    this.setState({
      customers:'',
      completed:0,
      searchKeyword:''
    });
    this.callApi()
      .then(res=>this.setState({customers: res}))
      .catch(err => console.log(err));
  }

  componentDidMount(){
    this.timer = setInterval(this.progress, 20);
    this.callApi()
      .then(res=>this.setState({customers: res}))
      .catch(err => console.log(err));

    this.callApi2()
      .then(res=>this.setState({studentcheck: res}))
      .catch(err => console.log(err));
  }

  callApi = async() =>{
    const response = await fetch('/customers');
    const body = await response.json();
    return body;
  }
  //test 2020-08-24
    stateRefresh2 = () => {
      this.setState({
        studentcheck:'',
        completed:0,
        searchKeyword:''
      });
      this.callApi2()
        .then(res=>this.setState({studentcheck: res}))
        .catch(err => console.log(err));
    }

    callApi2 = async() =>{
      const response = await fetch('/studentcheck');
      const body = await response.json();
      return body;
    }


  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  progress = () => {
    const {completed} = this.state;
    this.setState({completed : completed >=100 ? 0 : completed + 1});
  }

  render(){
    const filterdComponents = (data) => {
      data = data.filter((c)=>{
        return c.name.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return <Customer className={classes.tableBody} stateRefresh={this.stateRefresh}  key={c.sid} sid={c.sid} qid={c.qid} name={c.name} age={c.age} birthday={c.birthday} gender={c.gender} phone={c.phone} email={c.email} address={c.address} uniqueness={c.uniqueness}  />
      });
    }


    const filterdComponents2 = (data) => {
      data = data.filter((c)=>{
        return c.name.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return <StudentCheck className={classes.tableBody} stateRefresh2={this.stateRefresh2}  key={c.cid} cid = {c.cid} sid={c.sid} qid={c.qid} tid={c.tid} name={c.name} date_time={c.date_time} />
      });
    }


    const {classes} = this.props;
    const cellList = ["번호", "분기", "이름","나이", "생년월일", "성별", "핸드폰", "이메일", "주소", "특이사항", "설정"];
    const cellList2 = ["번호","학생 번호","분기","담당 선생님", "이름","출석 시간"];
    const cellList3 = ["아이디","이름"];
    return(
      <div className={classes.root}>
      <AppBar position="static">
        <Toolbar style={{height:"100px"}}>
          <Typography className={classes.title} variant="h6" noWrap>
            학생관리 프로그램
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="검색하기"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              name = "searchKeyword"
              value={this.state.searchKeyword}
              onChange={this.handleValueChange}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <div style={{display:"inline-block", width:"500px"}}>
      <CustomerAdd stateRefresh={this.stateRefresh}/>
      </div>
      <Paper>
        <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {cellList.map(c => {
                  return <TableCell className={classes.tableHead}>{c}</TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
                  {this.state.customers ?
                    filterdComponents(this.state.customers) :
                  <TableRow className={classes.tableBody}>
                      <TableCell className={classes.tableBody} colSpan="11" align="center">
                        <CircularProgress className={classes.tableBody} className={classes.progress} variant="determinate" value={this.state.completed} />
                      </TableCell>
                  </TableRow>
                  }
            </TableBody>
        </Table>
      </Paper>
      // 출석체크
      <Paper className={classes.checkzul}>
        <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {cellList2.map(c => {
                  return <TableCell className={classes.tableHead}>{c}</TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
                  {this.state.studentcheck ? this.state.studentcheck.map(c=>{
                    return(<StudentCheck className={classes.tableBody} stateRefresh={this.stateRefresh2}  key={c.cid} cid = {c.cid} sid={c.sid} qid={c.qid} tid={c.tid} name={c.name} date_time={c.date_time} />);
                  }):
                  <TableRow className={classes.tableBody}>
                      <TableCell className={classes.tableBody} colSpan="6" align="center">
                        <CircularProgress className={classes.tableBody} className={classes.progress} variant="determinate" value={this.state.completed} />
                      </TableCell>
                  </TableRow>
                  }
            </TableBody>
        </Table>
      </Paper>
      /*선생목록*/
      <Paper>
        <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {cellList3.map(c => {
                  return <TableCell className={classes.tableHead}>{c}</TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
                  {this.state.studentcheck ? this.state.studentcheck.map(c=>{
                    return(<StudentCheck className={classes.tableBody} stateRefresh2={this.stateRefresh2}  key={c.cid} cid = {c.cid} sid={c.sid} qid={c.qid} tid={c.tid} name={c.name} date_time={c.date_time} />);
                  }):
                  <TableRow className={classes.tableBody}>
                      <TableCell className={classes.tableBody} colSpan="6" align="center">
                        <CircularProgress className={classes.tableBody} className={classes.progress} variant="determinate" value={this.state.completed} />
                      </TableCell>
                  </TableRow>
                  }
            </TableBody>
        </Table>
      </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(App);
