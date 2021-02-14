import React from 'react';
import GNB from './GNB';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import PeopleIcon from '@material-ui/icons/People';
import PostAddIcon from '@material-ui/icons/PostAdd';
export default () => (
  <>
    <Divider />
    <GNB to="/admin/student" Icon={PeopleIcon} name="학생 관리" />
    <GNB to="/admin/teacher" Icon={PeopleIcon} name="선생님 관리" />
    <GNB to="/admin/quarter" Icon={PeopleIcon} name="반 관리" />
    <Divider />
    <GNB to="/admin/billing" Icon={PostAddIcon} name="학생 수업 배정" />
    <GNB to="/admin/lessonCharge" Icon={PostAddIcon} name="선생님 수업 배정" />
    <GNB to="/admin/lesson" Icon={DashboardIcon} name="수업 조회/마감" />
    <GNB to="/admin/lessonEnded" Icon={DashboardIcon} name="마감된 출석부" />
    <GNB to="/admin/calculator" Icon={DashboardIcon} name="수업료 정산" />
  </>
);
