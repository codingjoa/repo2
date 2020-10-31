const { OK } = require('../format');
const { setKey } = require('../sessionMapManager');
const cryptoRandomString = require('crypto-random-string');

/* @codingjoa
   세션을 생성함 a.k.a 로그인
*/

module.exports = async function(
  req, res
) {
  const newKey = cryptoRandomString({ length: 6 });
  req.session.key = newKey;
  setKey(req.session.tid, newKey);
  req.session.save();
  OK(res);
};
