import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

let globalsession = null;

async function getSessionForce() {
  // 무조건 세션 검사
  globalsession = await axios.get('/api/auth').then(r => r.data);
  return globalsession;
}

async function getSession() {
  // 세션 검사를 이미 했으면 패스
  if(globalsession) return globalsession;
  globalsession = await axios.get('/api/auth').then(r => r.data);
  return globalsession;
}

export default function useSession() {
  const [ session, setSession ] = useState({});

  const refreshSession = useCallback(() => {
    getSessionForce().then(setSession).catch(() => {});
  });

  useEffect(() => {
    getSession().then(setSession).catch(() => {});
  }, []);

  const signIn = useCallback((id, pw) => {
    axios.post('/api/auth/create', {id, pw})
    .then(r => {
      if(r.data?.message) alert(r.data.message);
    })
    .then(refreshSession);
  });

  const signOut = useCallback(() => {
    axios.get('/api/auth/delete')
    .then(r => {
      if(r.data?.message) alert(r.data.message);
    })
    .then(refreshSession);
  });
  return { session, refreshSession, signIn, signOut };
}
