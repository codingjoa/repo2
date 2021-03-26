import React from 'react';
import axios from 'axios';

function setDom(r) {
  dom = JSON.stringify(r.data);
  console.log(r.data);
}
let dom = null;

export default ({
  children
}) => {
  const [ count, setCount ] = React.useState(0);
  React.useLayoutEffect(() => {
    const render = () => setCount(c => c+1);
    axios.get('/api/dev/admin/settlement/proceeds/2020-10-01').then(setDom).then(render);
  }, []);
  return dom;
};
