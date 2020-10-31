const { OK, BadRequest } = require('../format');
const { pool } = require('../poolManager');

/* @codingjoa
   과거 날짜가 아닌지 확인
*/

module.exports = async function(
  req, res, next
) {
  const lessonMonth = req.params?.lessonMonth;
  const regex = /^(\d{4})\-(\d{1,2})-\d{1,2}/
  if(regex.test(lessonMonth)) {
    return BadRequest(res, new Error('날짜 정보가 잘못 되었습니다.'));
  }
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const [o, needYear, needMonth] = regex.exec(lessonMonth);
  let isPast = true;
  if(currentYear < needYear) isPast = false;
  else if(currentYear === needYear && currentMonth <= needMonth) isPast = false;
  isPast ? BadRequest(res, new Error('수정할 수 없는 날짜를 지정했습니다.')) : next();
};
