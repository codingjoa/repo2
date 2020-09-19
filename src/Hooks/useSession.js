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
    .then(refreshSession)
    .catch(e => e.response && alert(`로그인 실패: ${e.response.data.cause}`));
  }, []);

  const signOut = useCallback(() => {
    axios.get('/api/auth/logout', )
    .then(r => alert('로그아웃 되었습니다.'))
    .then(refreshSession)
    .catch(e => e.response.status===401 && alert('로그인 되지 않았습니다.'));
  }, []);
  return { session, refreshSession, signIn, signOut };
}
