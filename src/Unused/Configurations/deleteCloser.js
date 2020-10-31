import axios from 'axios';

export default (pathname, callback) => {
  return () => {
    axios.delete(pathname)
    .then(r => callback(null, r))
    .catch(callback);
  };
}
