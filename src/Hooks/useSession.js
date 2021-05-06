import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
function signInFunction(
  setState,
  handleError
) {
  return (
    id,
    password
  ) => {
    axios.post('/api/auth', {
      id, password
    })
    .then(setState)
    .catch(handleError);
  }
}
function signOutFunction(
  setState,
  handleError
) {
  return () => {
    axios.delete('/api/auth')
    .then(setState)
    .catch(handleError);
  }
}
async function getSessionForce() {
  // 무조건 세션 검사
  return await axios.get('/api/auth').then(r => r.data?.fetchedData);
}
export default () => {
  const [ session, setSession ] = React.useState(undefined);
  const location = ReactRouter.useLocation();
  const refreshSession = React.useCallback(() => {
    getSessionForce().then(result => {
      setSession(result);
      if(!sessionStorage?.teacherName) {
        sessionStorage.setItem('teacherName', result.name);
      }
    }).catch(e => {
      setSession(null);
      sessionStorage.clear();
    });
  }, [ setSession ]);
  const signIn = React.useCallback(signInFunction(refreshSession, err => {
    if(err.response && !alert(`로그인 실패: ${err.response.data.cause}`)) return;
  }), []);
  const signOut = React.useCallback(signOutFunction(() => {
    alert('로그아웃 되었습니다.');
    refreshSession();
  }, err => {
    if(err.response.status===401) alert('로그인 되지 않았습니다.')
  }), []);
  React.useLayoutEffect(refreshSession, [ location.pathname ]);
  return { session, refreshSession, signIn, signOut };
}
