const { OK, BadRequest, NotFound } = require('../format');
const { pool } = require('../poolManager');

module.exports = async function(
  req, res
) {
  const quarterID = req.params.quarterID;
  pool.query(
    'select studentInfo.*, studentID.studentCreated from studentID left join studentInfo on studentID.studentID=studentInfo.studentID'
  )
  .then(r => {
    !r.length && NotFound(res);
    r.length && OK(res, r);
  })
  .catch(e => BadRequest(res, e));
/*
const quarterID = req.params.qid;
    'select s.* from student s, quarter q, teacher t where s.quarterID=q.quarterID and q.teacherID=t.teacherID and q.quarterID=?',
    [ quarterID ?? null ]

*/
};
