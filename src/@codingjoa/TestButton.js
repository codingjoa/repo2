import React, { useState, useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';
import querystring from 'querystring';

function TestButton({ url }) {
  const GET = useCallback(() => {
    const queryString = prompt('쿼리 스트링 입력', '');
    if(queryString === null) return;
    const grace = axios.get(`${url}?${queryString}`);
    grace.then(r => r.data).then(JSON.stringify).then(alert);
    grace.then(console.log);
  }, []);

  const POST = useCallback(() => {
    const stringify = prompt('쿼리 스트링 입력', '');
    if(stringify === null) return;
    const json = querystring.parse(stringify);
    const grace = axios.post(`${url}`, json);
    grace.then(r => r.data).then(JSON.stringify).then(alert);
    grace.then(console.log);
  }, []);

  const DELETE = useCallback(() => {
    const queryString = prompt('쿼리 스트링 입력', '');
    if(queryString === null) return;
    const grace = axios.delete(`${url}?${queryString}`);
    grace.then(r => r.data).then(JSON.stringify).then(alert);
    grace.then(console.log);
  }, []);

  const PUT = useCallback(() => {
    const stringify = prompt('쿼리 스트링 입력', '');
    if(stringify === null) return;
    const json = querystring.parse(stringify);
    const grace = axios.put(`${url}`, json);
    grace.then(r => r.data).then(JSON.stringify).then(alert);
    grace.then(console.log);
  }, []);

  return (<><div>
    <h3>{url}</h3>
    <Button onClick={GET}>GET</Button>
    <Button onClick={POST}>POST</Button>
    <Button onClick={DELETE}>DELETE</Button>
    <Button onClick={PUT}>PUT</Button>
  </div></>);

}


export default function Testing() {
  // 경고창 띄우기용 state
  const [ open, setOpen ] = useState(false);

  // 컴포넌트 뿌리기
  return (
    <div>
      <TestButton url="/api/db/student" />
      <TestButton url="/api/db/quarter" />
      <TestButton url="/api/db/study" />
      <TestButton url="/api/db/teacher/change" />

    </div>
  );
}
