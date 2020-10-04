import { useState, useCallback } from 'react';
import axios from 'axios';

let globalsession = null;

async function getSessionForce() {
  // 무조건 세션 검사
  globalsession = await axios.get('/api/auth').then(r => r.data?.fetchedData);
  return globalsession;
}

export default function useSession(location) {
  const [ session, setSession ] = useState(undefined);

  const refreshSession = useCallback(() => {
    getSessionForce().then(setSession).catch(e => {
      //setSession(e.response?.status);
      setSession(null);
    });
  }, [ setSession ]);

  const signIn = useCallback((id, password) => {
    axios.post('/api/auth', {id, password})
    .then(refreshSession)
    .catch(e => {
      if(e.response && !alert(`로그인 실패: ${e.response.data.cause}`)) return;

    });
  }, []);

  const signOut = useCallback(() => {
    axios.delete('/api/auth')
    .then(r => alert('로그아웃 되었습니다.'))
    .then(refreshSession)
    .catch(e => e.response.status===401 && alert('로그인 되지 않았습니다.'));
  }, []);
  return { session, refreshSession, signIn, signOut };
}
