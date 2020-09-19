const { OK, BadRequest } = require('./format');

const defaultSession = {
  uid: null,
  signIn: null
};
module.exports = {
  isEmpty(req, res, next) {
/* @codingjoa
   세션이 없어야 할 수 있는 작업
*/
    const { user } = req?.session;
    if(user && BadRequest(res, new Error('이미 로그인 중입니다.'))) return;
    next();
  },

  touchSession(req, res, next) {
    const { user } = req?.session;
    if(user) {
      req.session.touch();
      req.session.save();
    }
    next();
  }
  
};
