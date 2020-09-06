
// 출석 취소, 출석한 학생 안한 학생 구분
module.exports = function quarter(pool) {
  return {

  async create(req, res) {
/* @codingjoa
   반을 생성하는 함수: post
   tid: 담당하게 될 선생 id
*/
    const { tid: teacherID } = req.session?.user ?? {};
    const grace = await pool.query({
      namedPlaceholders: true,
      sql: 'insert into quarter(teacherID) values (:teacherID)'
    },{ teacherID })
    .then(r => ({ complete: true, message: '반 생성에 성공했습니다.', data: r.insertId }))
    .catch(e => ({ complete: false, message: '반 생성에 실패했습니다.', cause: e.message }));
    res.json(grace);
  },
  async rename(req, res) {
/* @codingjoa
   선생이 자신이 관리하는 반의 이름을 변경합니다.
*/
    const { qid: quarterID, qname: quarterName } = req.body ?? {};
    const grace = await pool.query({
      namedPlaceholders: true,
      sql: 'update quarter set quarterName=:quarterName where quarterID=:quarterID'
    },{ quarterID, quarterName })
    .then(r => ({ complete: true, message: '반 이름 변경에 성공했습니다.' }))
    .catch(e => ({ complete: false, message: '반 이름 변경에 실패했습니다.' }));
    res.json(grace);
  },
  async fetch(req, res) {
/* @codingjoa
   선생이 자신이 담당하는 반의 목록을 조회합니다.
*/
    const { tid: teacherID } = req.session?.user ?? {};
    const grace = await pool.query(
      'select teacherID, quarterID, quarterName from quarter where teacherID=?',
      [ teacherID ]
    )
    .then(r => ({ complete: true, data: r }))
    .catch(e => ({ complete: false, message: '조회에 실패했습니다.' }));
    res.json(grace);
  }

  };
}
