import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';

export default function GNB({ to, Icon, name }) {
/* @codingjoa
   router link로 클릭할 때마다 특정 경로로 이동하는
   글로벌 내비게이션을 만듭니다.
   to: 이동할 경로
   Icon: 사용할 아이콘(material-ui/icons)
   name: 표시할 이름
*/
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit'}}>
      <ListItem button>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    </Link>
  );
}
