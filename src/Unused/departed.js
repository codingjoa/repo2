/*
function dateOnly(origin) {
  const localeString = new Date(Date.parse(origin)).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  return /^(\d+). (\d+). (\d+)/.test(localeString) ?
    `${RegExp.$1}-${RegExp.$2.length<2 ? `0${RegExp.$2}` : RegExp.$2}-${RegExp.$3.length<2 ? `0${RegExp.$3}` : RegExp.$3}`
  : ''; 
}

!values.name && (errors.name = '이름을 입력하세요.');
!(values.gender === '0' || values.gender === '1') && (errors.gender = '성별을 선택하세요.');
!values.birthday && (errors.birthday = '생년월일을 입력하세요.');
!/^\d{1,}/.test(values.phone) && (errors.phone = '- 없이 입력.');
//!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)    && (errors.email = '올바른 이메일 주소를 입력하세요.');
!values.address && (errors.address = '주소를 입력하세요.');



import OrderBy from './OrderBy';
import SortedTable from './SortedTable';

  const [ orderby, setOrderby ] = useState(null);
          <OrderBy
            orderby={orderby}
            setOrderby={setOrderby}
            orderList={[{ key: 'teacherID', visualName: '번호'}, { key: 'teacherName', visualName: '이름'}, { key: 'qlen', visualName: '반'}, { key: 'stlen', visualName: '학생 수'}, { key: 'slen', visualName: '수업 횟수'}]}
          />
          <OrderBy
            orderby={orderby}
            setOrderby={setOrderby}
            orderList={[
              { key: 'studentID', visualName: '번호'},
              { key: 'studentName', visualName: '이름'},
              { key: 'studentBirthday', visualName: '생일'},
              { key: 'studentGender', visualName: '성별'}
            ]}
          />
      <SortedTable
        Info={TeacherInfo}
        fieldNames={ ['번호', '이름', '반', '학생 수', '수업 횟수', '아이디', '비밀번호', '삭제'] }
        axiosResult={teachers}
        orderby={orderby}
        searchKeyword={searchKeyword}
        searchColumn={'teacherName'}
        reload={reload}
      />
      <SortedTable
        style={{ minWidth: '1200px' }}
        Info={StudentInfo}
        fieldNames={ [
          '번호',
          '이름',
          '생일',
          '성별',
          '전화번호',
          '이메일',
          '집주소',
          '특이사항',
          '수정/삭제'
        ] }
        axiosResult={students}
        orderby={orderby}
        searchKeyword={searchKeyword}
        searchColumn={'studentName'}
        reload={reloadStudent}
      />
*/
