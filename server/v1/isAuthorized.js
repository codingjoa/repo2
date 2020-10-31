const { BadRequest, Unauthorized } = require('../format');
const { certification } = require('../sessionMapManager');

module.exports = function(
  req, res, next
) {
  if(!(req.session?.tid && req.session?.key) && Unauthorized(res)) return;
  if(!certification(req.session.tid, req.session.key) && BadRequest(res, new Error('다른 컴퓨터에서 로그인 되었습니다.'))) return;
  next();
};
