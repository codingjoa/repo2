import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';

export default function({ children }) {
  return (
    <Toolbar disableGutter={true} variant="dense">
      {children}
    </Toolbar>
  );
}
