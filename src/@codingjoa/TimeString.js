export function TimeString(origin, dateOnly = false) {
/* @codingjoa
   2020-08-12T12:08:34 형태의 시간을
   한국어로 바꿔주는 코드
*/
  const localeString = new Date(Date.parse(origin)).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  return dateOnly ?
    /^(\d+). (\d+). (\d+)/.test(localeString) ? `${RegExp.$1}년 ${RegExp.$2}월 ${RegExp.$3}일` : localeString
  : /^(\d+). (\d+). (\d+)\s(\w+)\s(\d+):(\d+):(\d+)/.test(localeString) ? `${RegExp.$1}년 ${RegExp.$2}월 ${RegExp.$3}일 ${RegExp.$4} ${RegExp.$5}시 ${RegExp.$6}분 ${RegExp.$7}초` : localeString;
}

export function CurrentAge(origin) {
/* @codingjoa
   만 나이 계산 공식
   출처: https://m.blog.naver.com/PostView.nhn?blogId=wow0815&logNo=90178740921&proxyReferer=https:%2F%2Fwww.google.com%2F
*/
  const localeString = new Date(Date.parse(origin)).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const regexp = /^(\d+). (\d+). (\d+)/;
  const birthday = regexp.exec(localeString);
  const today = regexp.exec( new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) );
  const age = today[1] - 0 - birthday[1];
  if( today[2]-0 < birthday[2]-0 ) return age;
  if( today[2]-0 === birthday[2]-0) {
    if( today[3]-0 <= birthday[3]-0 ) {
      return age;
    }
  }
  return age - 1;
}