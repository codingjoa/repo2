const { OK, BadRequest } = require('../format.js');

module.exports = function modify(pool) { return {

  async studentUniqueness(req, res) {
    const studentID = req.params.stid;
    const studentUniqueness = req.body.uniqueness;
    pool.query(
      'update student set studentUniqueness=? where studentID=?',
      [ studentUniqueness ?? null, studentID ?? null ]
    )
    .then(r => {
      !r.affectedRows && BadRequest(res, new Error('변경되지 않았습니다.'));
      r.affectedRows && OK(res);
    })
    .catch(e => BadRequest(res, e));
  },
