import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Session({ setAuth }) {
  const location = useLocation();
  const [ state, setState ] = useState(null);
  useEffect(() => {
    axios.get('/api/auth').then(r => r.data).then(setAuth);
  }, [ location ]);
  return null
/*
  if(!state) {
    return (
      <h2>
        로딩중...
      </h2>
    );
  }
  if(!state.id) return <h2>아무것도 없었다.</h2>;
  return (
    <>
      <h2>세션 정보</h2>
      {`id : ${state.id ?? '없음'}`}<br />
      {`createdAt : ${state.signIn ?? ''}`}
      <Link to="session/session">Ang</Link>
    </>
  );
*/
}
