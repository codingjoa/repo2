import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import axios from 'axios';

const checkStyle = {
  textAlign:"center"

}

function TimeString(origin) {
  return new Date(Date.parse(origin)).toLocaleString('ko-KR', { timeZone: 'UTC' });
}

function CurrentAge(birth) {
/* @codingjoa
   만 나이 계산 공식
   출처: https://m.blog.naver.com/PostView.nhn?blogId=wow0815&logNo=90178740921&proxyReferer=https:%2F%2Fwww.google.com%2F
*/

node -e "
function ca(origin) {
  const regexp = /^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})/;
  const birthday = regexp.exec(origin);
  const today = regexp.exec( new Date().toJSON() );
  const age = today[1] - 0 - birthday[1];
  if( today[2]-0 < birthday[2]-0 ) return age;
  if( today[2]-0 === birthday[2]-0) {
    if( today[3]-0 <= birthday[3]-0 ) {
      return age;
    }
  }
  return age - 1;
}
console.log(ca('1998-9-5'));
console.log(ca('1998-9-6'));
console.log(ca('1998-9-7'));
console.log(ca('1998-8-5'));
console.log(ca('1998-8-6'));
console.log(ca('1998-8-7'));
console.log(ca('1998-10-5'));
console.log(ca('1998-10-6'));
console.log(ca('1998-10-7'));
"

  
}


export default function StudentCheck (props) {
    // checkCustomer(sid){
// axios.post(url, { sid, qid }
  //     const url = '/:sid';
  //     fetch(url, {
  //         method:'POST'
  //     });
  //

  // codingjoa@ 정보를 담는 state
  const [ datas, setDatas ] = useState(null);
  if(!datas) {
    // codingjoa@ studentCheck에 호출해야되는데 그거 아직 구현 안함
    axios.post('/api/studentCheck').then(r => r.data).then(setDatas);
    return null;
  };
  //학생 클릭 시 sid 값을 받아와서 학생 출력 정보를 출력한다.
  //<a href={row.sid} 이렇게는 안될 것 같은데.. 음
  return(
    <>
      {datas.map(row =>
        <TableRow style={checkStyle}>
          <TableCell style={checkStyle}>{row.cid}</TableCell>
          <TableCell style={checkStyle}>{row.sid}</TableCell>
          <TableCell style={checkStyle}>{row.qid}</TableCell>
          <TableCell style={checkStyle}>{row.tid}</TableCell>
          <TableCell style={checkStyle}>{row.name}</TableCell>
          <TableCell style={checkStyle}>{TimeString(row.date_time)}</TableCell>
        </TableRow>
      )}
    </>
  );
}
