
//학생관리 프로그램
import React, { useState, useReducer, useRef, useCallback, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  tableBody: {
    textAlign:"center",
    width:'100%'
  },
  tableHead: {
    fontSize:'1.0rem',
    textAlign:"center"
  },
}));

function List({key, checks, dispatch}) {
  const Ref = useRef();

  useEffect(() => {
    // undefined가 오는 문제가 있다.
    //alert(key);
    dispatch(Ref, false);
  }, []);
  return (
    <Checkbox checked={checks.get(Ref)} inputRef={Ref} key={key} onChange={()=>dispatch({ref: Ref, checked: !checks.get(Ref)})} />
  );
}


function reducer(state, action) {
  return state.set(action.ref, action.checked);
}

export default function TableForm({ fields, values }) {
  const classes = useStyles();
  const [ all, allCheck ] = useState(false);
  const [ checks, dispatch ] = useReducer(reducer, new Map());
  values = values ?? [[]]
  const selectAll = useCallback(() => {
/*
    checks.forEach((v, k) => {
      alert(v);
      alert(k);
    });
  */  
    
    if(!all) {
      //checks.forEach(({v, s}) => (v?.current?.ckecked !== undefined) ? s(true) : null);
    }
    else {
      //checks.forEach(({v, s}) => (v?.current?.ckecked !== undefined) ? s(false) : null);
    }
    allCheck(!all);
  });

  //const cellList = [<input type="checkbox" ></input>,"번호","프로필 이미지", "반", "이름","나이", "생년월일", "성별", "핸드폰", "이메일", "주소", "특이사항", "설정"];
  return (<>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><Checkbox checked={all} onClick={selectAll} disabled/></TableCell>
          {fields.map(name =>
            <TableCell className={classes.tableHead}>{name}</TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody className={classes.tableBody}>
        {values.map((value, i) => 
          <TableRow>
            <TableCell><List key={i} checks={checks} dispatch={dispatch} /></TableCell>
            {value.map(v =>
              <TableCell>{v}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  </>);
};








/*

const filterdComponents = (data) => {
      data = data.filter((c)=>{
        return c.name.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return <Customer className={classes.tableBody} stateRefresh={this.stateRefresh}  key={c.id} id={c.id} image={c.image} classes={c.classes} name={c.name} age={c.age} birthday={c.birthday} gender={c.gender} phone={c.phone} email={c.eamil} address={c.address} uniqueness={c.uniqueness}  />
      });
    }



<AppBar position="static">
        <Toolbar style={{height:"100px"}}>
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


      <Paper>
        
            {this.state.customers ?
              filterdComponents(this.state.customers) :
              <TableRow className={classes.tableBody}>
                <TableCell className={classes.tableBody} colSpan="12" align="center">
                  <CircularProgress className={classes.tableBody} className={classes.progress} variant="determinate" value={this.state.completed} />
                </TableCell>
              </TableRow>
            }
        
      </Paper>


      </div>
*/
/*
import Paper from '@material-ui/core/Paper';

import CircularProgress from '@material-ui/core/CircularProgress'
import {withStyles} from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
*/
/*
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
*/
