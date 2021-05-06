import React from 'react';
import { getToLink } from '../Templates/Format';
import GNB from './GNB';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Divider from '@material-ui/core/Divider';
import GroupIcon from '@material-ui/icons/Group';
export default () => (
  <>
    <GNB to="/" Icon={AssignmentIcon} name="담당 출석부 관리" />
    <GNB to={getToLink("/quarter")} Icon={GroupIcon} name="담당 팀 관리" />
    <Divider />
  </>
);
