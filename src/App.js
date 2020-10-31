import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import useSession from './Hooks/useSession';
import SignIn from './Templates/SignIn';

import { Root } from './BaseForm/Root';
import NavigationBar from './BaseForm/NavigationBar';
import TopBar from './BaseForm/TopBar';
import TopBarMain from './BaseForm/TopBarMain';
import Main from './BaseForm/Main';
import NavigationBarContents from './Routes/NavigationBarContents';
import TopBarContents from './Routes/TopBarContents';
import MainContents from './Routes/MainContents';

const Test = () => {
  const [ navOpen, setNavOpen ] = useState(false);
  const { session: auth, refreshSession, signIn, signOut } = useSession();
  const [ studyWeeks, setStudyWeeks ] = useState(null);
  const location = useLocation();
  React.useLayoutEffect(() => {
    refreshSession();
  }, [ location ]);

  if(auth === undefined) {
    return (<h2>잠시만 기다려 주세요...</h2>);
  }
  if(auth === null) {
    return(<SignIn signIn={signIn} />);
  }
  return (
    <Root.Provider
      value={{
        auth,
        signOut,
        navOpen,
        setNavOpen,
        studyWeeks,
        setStudyWeeks
      }}
    >
      <div style={{ display: 'flex' }}>
        <TopBar>
          <TopBarMain>
            <TopBarContents />
          </TopBarMain>
        </TopBar>
        <NavigationBar>
          <NavigationBarContents />
        </NavigationBar>
        <Main>
          <MainContents />
        </Main>
      </div>
    </Root.Provider>
  );
};


export default Test;
