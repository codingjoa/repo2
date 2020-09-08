import { useState, useCallback } from 'react';
import axios from 'axios';

let globalsession = null;

async function getSessionForce() {
  // 무조건 세션 검사
  globalsession = await axios.get('/api/auth').then(r => r.data);
  return globalsession;
}

export default function useSession(location) {
  const [ session, setSession ] = useState({});

  const refreshSession = useCallback(() => {
    getSessionForce().then(setSession).catch(() => {});
  }, [ setSession ]);

  const signIn = useCallback((id, pw) => {
    axios.post('/api/auth/login', {id, pw})
    .then(r => {
      if(r.data?.complete === true);
      else if(r.data?.complete === false) alert(r.data?.message);
      else alert('인증 서버가 작동하지 않습니다.');
    })
    .then(refreshSession);
  }, []);

  const signOut = useCallback(() => {
    axios.get('/api/auth/logout')
    .then(r => {
      if(r.data?.message) alert(r.data.message);
    })
    .then(refreshSession);
  }, []);
  return { session, refreshSession, signIn, signOut };
}
