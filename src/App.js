import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import useSession from './Hooks/useSession';
import SignIn from './Templates/SignIn';
import { Dashboard, Navigation } from './Templates/Dashboard';
import Page from './Templates/Page';
import Title from './Templates/Title';
import More from './Templates/More';
import TableForm from './Templates/TableForm';
import Customer from './Boards/Customer';
import CustomerAdd from './Boards/CustomerAdd';
import Quarters from './Boards/Quarters';
import Test from './Test/TestButton';


import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import GNB from './Boards/GNB';

const RouteSession = ({ per, children }) => {
  if(per) {
    return (<>{children}</>);
  }
  return null;
}

const Root = () => {
  const { session: auth, refreshSession, signIn, signOut } = useSession();

  return (
    <Router>
      <Route path="/">
        
      </Route>
      <RouteSession per={auth.uid > 0}>
        <div style={{display: 'flex'}}>
          <Navigation>
            <div>
              <GNB to="/" Icon={DashboardIcon} name="메인" />
              <GNB to="/student" Icon={PeopleIcon} name="학생 관리" />
              <GNB to="/quarter" Icon={AssignmentIcon} name="출석 관리" />
              <GNB to="/teacher" Icon={PeopleIcon} name="선생 관리" />
            </div>
          </Navigation>
          <Dashboard auth={auth}>
            <Route exact path="/">
              <Page>
                <Title>메인 페이지</Title>
                <Test />
              </Page>
            </Route>
            <Route exact path="/student">
              <Page>
{/* @codingjoa
학원 전체의 학생을 보여줍니다. 반에 상관 없이!
출석 처리는 할 수 없고. 학생들을 추가하거나 제거하거나
반의 이동을 실시할 수 있습니다.

codingjoa@ 아 고치는중임
*/}
                <Title>학생 관리</Title>
                <CustomerAdd />
                <More>More</More>
              </Page>
            </Route>
            <Route exact path="/quarter">
              <Page>
{/* @codingjoa
    선생이 자신의 반만 골라서 그 반에 속한 학생들만
    보여주고 그 학생들의 출석 승인을 실시합니다.
    학생을 출석부에 추가하려면 추가버튼을 눌러서 소속되지 않은 학생을 추가하세요.
    학생을 이 출석부에서 제거하려면 걍 하세요.
*/}
                <Title>출석 관리</Title>
                <CustomerAdd />
                <Quarters />
              </Page>
            </Route>
            <Route exact path="/teacher">
              <Page>
                <Title>선생 목록</Title>
                <TableForm fields={[
  'id',         'classes',
  'name',       'age',
  'birthday',   'gender',
  'phone',      'email',
  'address',    'uniqueness',
  'createDate', 'isDeleted'
]} />
                <></>
              </Page>
            </Route>
          </Dashboard>
          <button onClick={signOut}>로그아웃</button>
        </div>
      </RouteSession>
      <RouteSession per={auth.uid === undefined}>
        <h2>작업중...</h2>
      </RouteSession>
      <RouteSession per={auth.uid === null}>
        <SignIn signIn={signIn} />
      </RouteSession>
    </Router>
  );
};

export default Root;
