import React, { useContext } from 'react';
import { Root } from '../BaseForm/Root';
import GNB from '../@codingjoa/GNB';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Divider from '@material-ui/core/Divider';

export default function TopBarContents() {
  const { auth } = useContext(Root);
  return (
    <div>
      <GNB to="/" Icon={AssignmentIcon} name="출석 관리" />
      {auth && auth.op ? (<>
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
      </>) : null}
    </div>
  );
}
