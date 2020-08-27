import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SignIn from './signIn/SignIn';
import Dashboard from './dashboard/Dashboard';
import useSession from './custom/useSession';

import Page from './dashboard/custom/Page';
import Title from './dashboard/Title';
import Customer from './dashboard/custom/Customer';
import More from './dashboard/custom/More';
import TableForm from './dashboard/custom/TableForm';
import CustomerAdd from './dashboard/custom/CustomerAdd';

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
      <RouteSession per={auth.id > 0}>
        <Dashboard auth={auth}>
          <Route exact path="/">
            <Page>
              <Title>메인 페이지</Title>
            </Page>
          </Route>
          <Route exact path="/student">
            <Page>
              <Title>학생 관리</Title>
              <CustomerAdd />
              <Customer />
              <More>More</More>
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
      </RouteSession>
      <RouteSession per={auth.id === undefined}>
        <h2>작업중...</h2>
      </RouteSession>
      <RouteSession per={auth.id === null}>
        <SignIn signIn={signIn} />
      </RouteSession>
    </Router>
  );
};

export default Root;
