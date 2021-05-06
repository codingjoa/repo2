import React from 'react';
import * as ReactRouter from 'react-router-dom';
import { getHandlar } from '../../Templates/Format';
import { useSelector } from '../../Templates/SelectingMonth';
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
function billingRefundAtToString(
  lessonMonth
) {
  if(typeof lessonMonth !== 'string') {
    return '';
  }
  const lm = new Date(lessonMonth);
  return `${lm.getFullYear()}년 ${lm.getMonth()+1}월 ${lm.getDate()}일`;
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
function fetchStudentRefunds(
  year,
  month,
  page,
  size,
  keyword,
  callback
) {
  const len = (`${month}`.length === 1);
  const lessonMonth= `${year}-${len ? '0' : ''}${month}-01`;
  const offset = page * size;
  axios.get(`/api/admin/billing/refunds/${lessonMonth}?offset=${offset}&size=${size}&keyword=${keyword}`)
  .then(
    result => callback(null, result, { year, month, page, keyword }),
    err => callback(err)
  );
}
function Page404({
  status
}) {
  if(status === 404) {
    return (<>환불된 수업료 정보가 없습니다.</>);
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
            <th>중도 환불 여부</th>
            <th>월 수업료</th>
            <th>환불된 수업료</th>
            <th>환불 일자</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {rows && rows.map(
            row => (<tr key={row.studentID} style={{ textAlign: 'center' }} >
              <td>{row.studentName}</td>
              <td>{row.studentPhone}</td>
              <td>{lessonMonthToString(row?.lessonMonth)}</td>
              <td>{row.quarterName}</td>
              <td>{row.billingRefundMiddleCode===1 ? 'Y' : 'N'}</td>
              <td>{numberWithCommas(row?.billingPrice ?? 0)}원</td>
              <td>{numberWithCommas(row?.billingRefundPrice ?? 0)}원</td>
              <td>{billingRefundAtToString(row?.billingRefundAt)}</td>
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
  const { year, month, YearSelector } = useSelector({
    // 이전페이지인 여기로 돌아왔을 때/새로고침 했을 때, 마지막 검색 결과인 년월을 초기값으로 지정
    year: location.state?.previous?.year,
    month: location.state?.previous?.month
  });
  const callback = getHandlar(history.replace);
  // 페이지네이션
  const [ page, setPage ] = React.useState(location?.state?.previous?.page ?? 0);
  // 검색어 키워드 state
  const searchRef = React.useRef();
  const handleClick = (page = 0) => {
    setPage(page);
    history.replace({
      state: null
    });
    fetchStudentRefunds(
      year,
      month,
      page,
      25,
      searchRef.current.value,
      callback
    );
  };
  // 페이지 첫 로드시 무조건 fetch
  React.useLayoutEffect(() => {
    if(location?.state?.previous?.keyword !== undefined) {
      searchRef.current.value = location?.state?.previous?.keyword;
    }
    fetchStudentRefunds(
      year,
      month,
      page,
      25,
      searchRef.current.value,
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
              onClick={e => handleClick()}
              variant="contained"
            >
              조회
            </Button>
          )}
        />
        <Box
          mt={1}
        >
          <TextField
            fullWidth
            inputRef={searchRef}
            label="팀 또는 학생 이름으로 검색"
            InputProps={{ onKeyDown: (e => e.keyCode == 13 && handleClick())}}
            size="small"
            variant="outlined"
          />
        </Box>
      </Page>
      <Page404 status={location?.state?.status} />
      <Page200
        rows={location?.state?.data?.rows}
        status={location?.state?.status}
      />
      <DependencyPaginationButtons
        handleClick={handleClick}
        page={page}
        pageSize={location?.state?.data?.totalPage ?? null}
      />
    </>
  );

}


function DependencyPaginationButtons({
  page,
  pageSize,
  handleClick
}) {
  const BarSize = 5;
  // 불변의 렌더링된 모든 버튼들
  const inActivated = React.useMemo(() => {
    const buttons = [];
    for(let i=0; i<pageSize; i++) {
      buttons[i] = (
        <Box
          key={`inActivated:${i}`}
          m={0.25}
        >
          <Button
            onClick={e => handleClick(i)}
            size="small"
            style={{ minWidth: '3rem', maxWidth: '3rem' }}
            variant="outlined"
          >
            {i+1}
          </Button>
        </Box>
      );
    }
    return buttons;
  }, [
    pageSize
  ]);
  const Activated = React.useMemo(() => {
    const buttons = [];
    for(let i=0; i<pageSize; i++) {
      buttons[i] = (
        <Box
          key={`Activated:${i}`}
          m={0.25}
        >
          <Button
            color="primary"
            size="small"
            style={{ minWidth: '3rem', maxWidth: '3rem' }}
            variant="contained"
          >
            {i+1}
          </Button>
        </Box>
      );
    }
    return buttons;
  }, [
    pageSize
  ]);
  // pageSize가 없다면 버튼을 그리지 않습니다.
  if(pageSize === null) {
    return null;
  }
  // 버튼 목록 그리기
  const pageLevel = Math.floor(page * (1 / BarSize));
  const pagination = [];
  let i = pageLevel * BarSize;
  while(i < (pageLevel * BarSize) + BarSize && i < pageSize) {
    pagination[i] = (page === i) ? Activated[i] : inActivated[i];
    i++;
  }
  return (
    <Page>
      <Box
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        {i-BarSize>0 &&
          <Box
            m={0.25}
          >
            <Button
              onClick={e => handleClick(i - BarSize - 1)}
              size="small"
              style={{ minWidth: '3rem', maxWidth: '3rem' }}
              variant="outlined"
            >
              &lt;
            </Button>
          </Box>
        }
        {pagination}
        {i<pageSize &&
          <Box
            m={0.25}
          >
            <Button
              onClick={e => handleClick(i)}
              size="small"
              style={{ minWidth: '3rem', maxWidth: '3rem' }}
              variant="outlined"
            >
              &gt;
            </Button>
          </Box>
        }
      </Box>
    </Page>
  );
}
