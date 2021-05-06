import React from 'react';
import { getToLink } from '../Templates/Format';
import GNB from './GNB';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PeopleIcon from '@material-ui/icons/People';
export default () => (
  <>
    <GNB to={getToLink("/admin/student")} Icon={PeopleIcon} name="학생 관리" />
    <GNB to={getToLink("/admin/quarter")} Icon={PeopleIcon} name="팀 관리" />
    <GNB to={getToLink("/admin/teacher")} Icon={PeopleIcon} name="강사 관리" />
    <GNB to={getToLink("/admin/lesson")} Icon={DashboardIcon} name="출석부 관리" />
    <Divider />
    <GNB to={getToLink("/admin/calculator")} Icon={MonetizationOnIcon} name="수업료 정산" />
    <GNB to={getToLink("/admin/students/unpaid")} Icon={MonetizationOnIcon} name="미납금 조회" />
    <GNB to={getToLink("/admin/students/refunds")} Icon={MonetizationOnIcon} name="환불금 조회" />
    <Divider />
  </>
);
