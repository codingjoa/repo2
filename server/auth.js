
let uid = 0;
const defaultSession = {
  uid: null,
  signIn: null
};
module.exports = {
  isEmpty(req, res, next) {
/* @codingjoa
   세션이 없어야 할 수 있는 작업
*/
    console.log('test');
    if(req.session?.user) res.json({ complete: false, message: '이미 로그인 중입니다.' });
    else next();
  },
  editableSession(req, res, next) {
/* @codingjoa
   세션이 있어야 할 수 있는 작업
*/
    if(req.session?.user) next();
    else res.json({ complete: false, message: 'session is empty.' });
  },
  getSession(req, res, next) {
    if(req.session?.user) next();
    else res.json({ complete: false, message: '세션이 없습니다.' });
  },
  touchSession(req, res, next) {
    if(req.session?.user) {
      req.session.touch();
      req.session.save();
    }
    next();
  },
  createSession(req, res) {
/* @codingjoa
   세션을 생성함 a.k.a 로그인
*/
    req.session.user = {
      ...req.session.user,
      uid: ++uid,
      signIn: new Date()
    };
    req.session.save();
    res.json({ complete: true, message: '로그인 되었습니다.' });
  },
  deleteSession(req, res) {
/* @codingjoa
   세션 삭제 a.k.a 로그아웃
*/
    req.session.destroy();
    res.json({ complete: true, message: '로그아웃 되었습니다.' });
  }
};
