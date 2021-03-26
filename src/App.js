import React from 'react';
import Main from './SubPages/Panel';
import NavigationBar from './Navigations/Panel';
import SignIn from './Templates/SignIn';
import TopBar from './TopBar/Panel';
import useSession from './Hooks/useSession';
export default () => {
  // 네비게이션 바 스테이트
  const [ navOpen, setNavOpen ] = React.useState(false);
  // 세션관리
  const { session: auth, signIn, signOut } = useSession();
  if(auth === undefined) {
    return (<h2>잠시만 기다려 주세요...</h2>);
  }
  if(auth === null) {
    return(<SignIn signIn={signIn} />);
  }
  return (
    <>
      <div style={{ display: 'flex' }}>
        <TopBar
          setNavOpen={setNavOpen}
          signOut={signOut}
        />
        <NavigationBar
          auth={auth}
          navOpen={navOpen}
          setNavOpen={setNavOpen}
        />
        <Main
          auth={auth}
        />
      </div>
    </>
  );
};
