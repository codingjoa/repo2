const { OK } = require('../format');
const { getInfo } = require('../sessionMapManager');

module.exports = function(
  req, res
) {
  const info = getInfo(req.session.tid);
  OK(res, info ?? {});
//req.session.tid = ;
//setInfo(teacherID, );
//{ tid: null, id: null, uid: null, signIn: null, op: null });
};
