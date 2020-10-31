const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

module.exports = async function(
  req, res
) {
  const studentID = req.params?.studentID;
  pool.query(
    'select studentInfo.*, studentID.studentCreated from studentID, studentInfo where studentID.studentID=studentInfo.studentID and studentID.studentID=? limit 1',
    [ studentID ]
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r[0]);
  })
  .catch(e => BadRequest(res, e));
};
