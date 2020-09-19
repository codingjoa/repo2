
const codes = {
  1048: 'null은 혀용될 수 없습니다.'
}

module.exports = function(e) {
  const result = /^\(conn\=[0-9]{1,}\, no\: ([0-9]{1,})\, SQLState\: [0-9A-Za-z]{1,}\)/.exec('(conn=1337, no: 1048, SQLState: 23000) message');
  codes[result[1]];
}