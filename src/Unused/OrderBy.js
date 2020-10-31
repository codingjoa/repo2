import React, { useLayoutEffect, useMemo } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function OrderBy({ orderby, setOrderby, orderList}) {
  useLayoutEffect(() => {
    setOrderby(`asc/${orderList[0].key}`);
  }, []);
  const memo = useMemo(() => {
    return orderList.map(row => [{
      key: `asc/${row.key}`,
      visualName: `${row.visualName} 내림차순`
    },{
      key: `desc/${row.key}`,
      visualName: `${row.visualName} 오름차순`
    }]).flat();
  }, []);

  if(orderby === null) return (<></>);
  return (
    <div style={{ verticalAlign: 'bottom' }}>
      <Select
        value={orderby}
        onChange={e => setOrderby(e.target.value)}
      >
        {memo.map(row => 
          <MenuItem value={row.key}>{row.visualName}</MenuItem>
        )}
      </Select>
    </div>
  );
}
