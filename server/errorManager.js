const { BadRequest, NotFound, InternalError, CommonError, NotFoundError } = require('./format');

module.exports = (err, req, res, next) => {
  if(err instanceof CommonError) {
    BadRequest(res, err);
  } else if(err instanceof NotFoundError) {
    NotFound(res);
  } else {
    InternalError(res, err);
  }
  next();
};
