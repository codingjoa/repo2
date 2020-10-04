import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import useSession from './Hooks/useSession';
import SignIn from './Templates/SignIn';
import Page from './Templates/Page';
import Title from './Templates/Title';

import Study from './@codingjoa/Study';
import Quarters from './@codingjoa/Quarters';
import Teacher from './@codingjoa/Teacher';
import Index from './@codingjoa/Index';

import { Root } from './NavigationBar/Root';

import NavigationBar from './NavigationBar/NavigationBar';
import TopBar from './NavigationBar/TopBar';
import Main from './NavigationBar/Main';
import NavigationBarContents from './Routes/NavigationBarContents';
import TopBarContents from './Routes/TopBarContents';
import MainContents from './Routes/MainContents';

/*

            <Route exact path="/">
              <Page>
                <Title>메인 페이지</Title>
                <Index tid={auth && auth.tid} />
              </Page>
            </Route>
            <Route exact path="/student">
              <Page>
                <Title>학생 관리</Title>
                <Quarters />
              </Page>
            </Route>
            <Route exact path="/quarter">
              <Page>
                <Title>출석 관리</Title>
                <Study />
              </Page>
            </Route>
            <RouteSession per={auth && auth.op}>
              <Route exact path="/teacher">
                <Page>
                  <Title>선생님 목록</Title>
                  <Teacher />
                  <></>
                </Page>
              </Route>
            </RouteSession>
        </div>
      </RouteSession>

*/

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
    <Root.Provider value={{ auth, signOut, navOpen, setNavOpen, studyWeeks, setStudyWeeks }}>
      <div style={{ display: 'flex' }}>
        <TopBar>
          <TopBarContents />
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
