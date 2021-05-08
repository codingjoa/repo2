import React from 'react';
import * as ReactRouter from 'react-router-dom';
import { getHandlar } from '../../Templates/Format';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Page from '../../Templates/Page';
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function lessonMonthToString(
  lessonMonth
) {
  if(typeof lessonMonth !== 'string') {
    return '';
  }
  const lm = new Date(lessonMonth);
  return `${lm.getFullYear()}년 ${lm.getMonth()+1}월`;
}
function lessonMonthToFormat(
  lessonMonth
) {
  if(lessonMonth===undefined) {
    return null;
  }
  const lm = new Date(lessonMonth);
  return `${lm.getFullYear()}-${lm.getMonth()+1}-${lm.getDate()}`;
}
function fetchStudentUnpaids(keyword, callback) {
  axios.get(`/api/admin/student/unpaid?keyword=${keyword}`)
  .then(
    result => callback(null, result, { keyword }),
    err => callback(err)
  );
}
function Page404({
  status
}) {
  if(status === 404) {
    return (<>미납된 수업료 정보가 없습니다.</>);
  }
  return null;
}
function Page500({
  status
}) {
  if(status === 500) {
    return (<>알 수 없는 오류.</>);
  }
  return null;
}
function Page200({
  rows,
  status
}) {
  const history = ReactRouter.useHistory();
  if(status !== 200) {
    return null;
  }
  return (
    <Page>
      <table>
        <thead>
          <tr>
            <th>학생 이름</th>
            <th>전화번호</th>
            <th>수업 기간</th>
            <th>팀 명</th>
            <th>수업 진행 여부</th>
            <th>월 수업료</th>
            <th>미납된 수업료</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(
            row => (<tr key={`${row.studentID}-${row.lessonMonth}`} style={{ textAlign: 'center' }} >
              <td>{row.studentName}</td>
              <td>{row.studentPhone}</td>
              <td>{lessonMonthToString(row?.lessonMonth)}</td>
              <td>{row.quarterName}</td>
              <td>{row.lessonRegCode===1 ? 'Y' : 'N'}</td>
              <td>{numberWithCommas(row?.billingPrice ?? 0)}원</td>
              <td>{numberWithCommas(row?.billingUnpaidCode ?? 0)}원</td>
              <td>
                <Button
                  color="primary"
                  onClick={() => history.push(`/admin/billing/${row.studentID}/${lessonMonthToFormat(row?.lessonMonth)}`)}
                  size="small"
                  variant="contained"
                >
                  변경
                </Button>
              </td>
            </tr>)
          )}
        </tbody>
      </table>
    </Page>
  );
}


export default function() {
  const history = ReactRouter.useHistory();
  const location = ReactRouter.useLocation();
  const callback = getHandlar(history.replace);
  // 검색어 키워드 state
  const searchRef = React.useRef();
  const handleClick = (page = 0) => {
    history.replace({
      state: null
    });
    fetchStudentUnpaids(
      searchRef.current.value,
      callback
    );
  };
  // 페이지 첫 로드시 무조건 fetch
  React.useLayoutEffect(() => {
    if(location?.state?.previous?.keyword !== undefined) {
      searchRef.current.value = location?.state?.previous?.keyword;
    }
    const keyword = location?.state?.previous?.keyword ?? '';
    if(location?.state?.status !== undefined) {
      history.replace({ state: null });
    }
    fetchStudentUnpaids(keyword, callback);
  }, []);
  return (
    <>
      <Page>
        <Box
          display="flex"
        >
          <Box
            alignSelf="center"
            flexGrow={1}
          >
            <TextField
              fullWidth
              InputProps={{ onKeyDown: (e => e.keyCode == 13 && handleClick())}}
              inputRef={searchRef}
              label="팀 또는 학생 이름으로 검색"
              size="small"
              variant="outlined"
            />
          </Box>
          <Box
            ml={2}
            mr={2}
          >
            <Button
              color="primary"
              onClick={() => handleClick()}
              variant="contained"
            >
              검색
            </Button>
          </Box>
        </Box>
      </Page>
      <Page404 status={location?.state?.status} />
      <Page500 status={location?.state?.status} />
      <Page200 status={location?.state?.status} rows={location?.state?.data} />
    </>
  );

}
