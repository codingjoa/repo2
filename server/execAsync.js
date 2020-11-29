function execAsync(fn, callback) {
  return (...params) => {
    fn(...params)
    .then(result => callback(null, result),
      callback
    );
  };
}
module.exports = execAsync;