import axios from 'axios';

export default (pathname, body, callback, usePatch = false) => {
  return inbody => {
    (usePatch ? axios.patch(pathname, {...body, ...inbody}) : axios.put(pathname, { ...body, ...inbody }))
    .then(r => callback(null, r))
    .catch(callback);
  };
}
