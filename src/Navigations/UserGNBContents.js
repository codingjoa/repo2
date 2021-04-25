import React from 'react';
import GNB from './GNB';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DashboardIcon from '@material-ui/icons/Dashboard';
export default () => (
  <>
    <GNB to="/" Icon={AssignmentIcon} name="나의 출석부" />
    <GNB to="/quarter" Icon={DashboardIcon} name="나의 팀" />
  </>
);
