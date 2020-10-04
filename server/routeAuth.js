const router = require('express').Router();
const authorization = require('./db/authorization');
const unauthorization = require('./db/unauthorization');
const isAuthorized = require('./db/isAuthorized');
const getAuthorizationInfo = require('./db/getAuthorizationInfo');
const passwordCertification = require('./db/passwordCertification');

/* @codingjoa
   GET #세션 상태 확인
   POST #로그인
   DELETE #로그아웃
*/

router.get('/',
  isAuthorized,
  getAuthorizationInfo
);
router.post('/',
  passwordCertification,
  authorization
);
router.delete('/',
  isAuthorized,
  unauthorization
);

module.exports = router;
