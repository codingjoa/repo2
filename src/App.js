import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import useSession from './Hooks/useSession';
import SignIn from './Templates/SignIn';
import { Dashboard, Navigation } from './Templates/Dashboard';
import Page from './Templates/Page';
import Title from './Templates/Title';

import GNB from './@codingjoa/GNB';
import Study from './@codingjoa/Study';
import Quarters from './@codingjoa/Quarters';
import Teacher from './@codingjoa/Teacher';
import Index from './@codingjoa/Index';
import Example from './@codingjoa/FormikExample';

/* @codingjoa
   Material UI Icons
*/
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';

const TouchSession = ({ refreshSession }) => {
  const location = useLocation();
  React.useLayoutEffect(() => {
    refreshSession();
  }, [ location ]);
  return (<></>);
};

const RouteSession = ({ per, children }) => {
  if(per) {
    return (<>{children}</>);
  }
  return null;
};

const Root = () => {
  const { session: auth, refreshSession, signIn, signOut } = useSession();
  return (
    <Router>
      <TouchSession refreshSession={refreshSession} />
      <Route path="/">
        
      </Route>
      <RouteSession per={auth.uid > 0}>
        <div style={{display: 'flex'}}>
          <Navigation SignOut={signOut}>
            <div>
              <GNB to="/" Icon={DashboardIcon} name="메인" />
              <GNB to="/student" Icon={PeopleIcon} name="학생 관리" />
              <GNB to="/quarter" Icon={AssignmentIcon} name="출석 관리" />
              <RouteSession per={auth.op}>
                <GNB to="/teacher" Icon={PeopleIcon} name="선생님 관리" />
              </RouteSession>
            </div>
          </Navigation>
          <Dashboard auth={auth}>
            <Route exact path="/">
              <Page>
                <Title>메인 페이지</Title>
                <Index tid={auth.tid} />
<Example />
              </Page>
            </Route>
            <Route exact path="/student">
              <Page>
{/* @codingjoa
    반 추가, 이름 수정, 제거
    학생 추가, 수정, 제거
*/}
                <Title>학생 관리</Title>
                <Quarters />
              </Page>
            </Route>
            <Route exact path="/quarter">
              <Page>
{/* @codingjoa
    오늘의 출석부를 생성
    학생 목록으로 출석/결석 처리
    Note. 학생 목록은 학생 관리에수 해야 함
*/}
                <Title>출석 관리</Title>
                <Study />
              </Page>
            </Route>
            <RouteSession per={auth.op}>
              <Route exact path="/teacher">
                <Page>
{/* @codingjoa
    선생님 추가, 수정, 제거
    비밀번호 초기화
*/}
                  <Title>선생님 목록</Title>
                  <Teacher />
                  <></>
                </Page>
              </Route>
            </RouteSession>
          </Dashboard>
        </div>
      </RouteSession>
      <RouteSession per={auth.uid === undefined}>
        <h2>잠시만 기다려 주세요...</h2>
      </RouteSession>
      <RouteSession per={auth.uid === null}>
        <SignIn signIn={signIn} />
      </RouteSession>
    </Router>
  );
};

export default Root;
