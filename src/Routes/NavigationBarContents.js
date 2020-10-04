import React, { useContext } from 'react';
import { Root } from '../NavigationBar/Root';
import GNB from '../@codingjoa/GNB';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';

export default function TopBarContents() {
  const { auth } = useContext(Root);
  return (
    <div>
      <GNB to="/" Icon={DashboardIcon} name="메인" />
      
      <GNB to="/quarter" Icon={AssignmentIcon} name="출석 관리" />
      {auth && auth.op ? (<>
<GNB to="/students" Icon={PeopleIcon} name="학생 관리" />
        <GNB to="/teachers" Icon={PeopleIcon} name="선생님 관리" />
<GNB to="/quarters" Icon={PeopleIcon} name="반 관리" />


      </>) : null}
    </div>
  );
}
