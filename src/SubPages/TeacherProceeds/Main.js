import React from 'react';
import * as ReactRouter from 'react-router-dom';
import { getHandlar } from '../../Templates/Format';
import { useSelector } from '../../Templates/SelectingMonth';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Page from '../../Templates/Page';
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function fetchTeacherProceeds(year, month, callback) {
  const len = (`${month}`.length === 1);
  const lessonMonth= `${year}-${len ? '0' : ''}${month}-01`;
  axios.get(`/api/admin/calculator/proceed/${lessonMonth}`)
  .then(
    result => callback(null, result, { year, month }),
    err => callback(err, null, { year, month })
  );
}
function Page404({
  month,
  status,
  year
}) {
  if(status === 404) {
    return (<>{year}년 {month}월의 수업료 정보가 없습니다.</>);
  }
  return null;
}
function Page200({
  rows,
  status
}) {
  if(status !== 200) {
    return null;
  }
  return (
    <Page>
      <table>
        <thead>
          <tr>
            <th>사번</th>
            <th>강사 이름</th>
            <th>총 학생 수</th>
            <th>총 수업료</th>
            <th>환불된 수업료</th>
            <th>미납된 수업료</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(
            row => (<tr key={row.teacherID} style={{ textAlign: 'center' }} >
              <td>{row.teacherID}</td>
              <td>{row.teacherName}</td>
              <td>{row.totalStudent}명</td>
              <td>{numberWithCommas(row?.totalPrice ?? 0)}원</td>
              <td>{numberWithCommas(row?.totalRefundPrice ?? 0)}원</td>
              <td>{numberWithCommas(row?.totalUnpaidPrice ?? 0)}원</td>
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
  const { year, month, YearSelector } = useSelector({
    // 이전페이지인 여기로 돌아왔을 때/새로고침 했을 때, 마지막 검색 결과인 년월을 초기값으로 지정
    year: location.state?.previous?.year,
    month: location.state?.previous?.month
  });
  const callback = getHandlar(history.replace);
  // 페이지 첫 로드시 무조건 fetch
  React.useLayoutEffect(() => {
    fetchTeacherProceeds(
      year,
      month,
      callback
    );
  }, []);
  return (
    <>
      <Page>
        <YearSelector
          submitButton={(
            <Button
              color="primary"
              onClick={e => fetchTeacherProceeds(
                year,
                month,
                callback
              )}
              variant="contained"
            >
              조회
            </Button>
          )}
        />
      </Page>
      <Page404 status={location?.state?.status}
        year={location?.state?.previous?.year}
        month={location?.state?.previous?.month}
      />
      <Page200 status={location?.state?.status} rows={location?.state?.data} />
    </>
  );

}
