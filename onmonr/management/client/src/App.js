import React, { Component } from 'react';
import CustomerAdd from './components/CustomerAdd';
import './App.css';
import Customer from './components/Customer';
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

  },
  grow:{
    flexGrow: 1,
  },
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
});

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      customers:'',
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
  }

  callApi = async() =>{
    const response = await fetch('/api/customers');
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
        return <Customer stateRefresh={this.stateRefresh}  key={c.id} id={c.id} image={c.image} classes={c.classes} name={c.name} age={c.age} birthday={c.birthday} gender={c.gender} phone={c.phone} email={c.eamil} address={c.address} uniqueness={c.uniqueness}  />
      });
    }

    const {classes} = this.props;
    const cellList = [<input type="checkbox" ></input>,"번호","프로필 이미지", "반", "이름","나이", "생년월일", "성별", "핸드폰", "이메일", "주소", "특이사항", "설정"];
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
            <TableBody>
                  {this.state.customers ?
                    filterdComponents(this.state.customers) :
                  <TableRow style={{textAlign:"center"}}>
                      <TableCell colSpan="6" align="center">
                        <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed} />
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
