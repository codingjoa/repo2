import React from 'react';
import { getToLink } from '../Templates/Format';
import GNB from './GNB';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import PeopleIcon from '@material-ui/icons/People';
import PostAddIcon from '@material-ui/icons/PostAdd';
export default () => (
  <>
    <Divider />
    <GNB to="/admin/billing" Icon={PostAddIcon} name="학생 수업 배정" />
    <Divider />
    <GNB to={getToLink("/admin/student")} Icon={PeopleIcon} name="학생 관리" />
    <GNB to={getToLink("/admin/quarter")} Icon={PeopleIcon} name="팀 관리" />
    <GNB to="/admin/teacher" Icon={PeopleIcon} name="강사 관리" />
    <GNB to={getToLink("/admin/lesson")} Icon={DashboardIcon} name="출석부 관리" />
    <Divider />
    <GNB to="/admin/settle?pg=1" Icon={DashboardIcon} name="실험" />
    <GNB to="/admin/calculator" Icon={DashboardIcon} name="수업료 정산" />
    <Divider />
  </>
);
