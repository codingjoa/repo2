function exec(fn, callback) {
  return (...params) => {
    try {
      const result = fn(...params);
      callback(null, result);
    }
    catch(err) {
      callback(err);
    }
  };
}
module.exports = exec;