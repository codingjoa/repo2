import React from 'react';
import * as ReactRouter from 'react-router-dom';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Page from '../../Templates/Page';
import Deductions from './Deductions';
import SelectingMonth from './SelectingMonth';
import SelectingMonths from './SelectingMonths';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
let dom = null;
const After = ({
  param
}) => (<>
  <Typography
    variant="subtitle1"
  >
    세율 등록
  </Typography>
  <Typography
    variant="subtitle1"
  >
    선생별 수당 등록
  </Typography>
</>);
const header = {
  clear(
    deductions = {},
    proceeds = new Map()
  ) {
    this.deductions = deductions;
    this.proceeds = proceeds;
  },
  deductions: null,
  getAll() {
    const objective = Array.from(this.proceeds.entries()).map(([
      teacherID,
      rest
    ]) => ({
      teacherID,
      ...rest
    }));
    return objective;
    //alert(JSON.stringify(objective));
  },
  getDefaultValue(
    id,
    field
  ) {
    if(!this.proceeds instanceof Map) {
      throw new TypeError('proceeds table is undefined.');
    }
    const teacher = this.proceeds.has(id) ? this.proceeds.get(id) : null;
    if(teacher === null) {
      throw new ReferenceError(`${id} is not found.`);
    }
    const value = teacher[field];
    return value===null ? 0 : value;
  },
  proceeds: null,
  setDeductions(
    field,
    value
  ) {
    this.deductions[field] = value;
  },
  setProceeds(
    id,
    field,
    value
  ) {
    if(!this.proceeds instanceof Map) {
      throw new TypeError('proceeds table is undefined.');
    }
    const teacher = this.proceeds.has(id) ? this.proceeds.get(id) : null;
    if(teacher === null) {
      throw new ReferenceError(`${id} is not found.`);
    }
    teacher[field] = value;
  }
};
function fetchProceeds(
  lessonMonth,
  callback
) {
  axios.get(`/api/dev/admin/settlement/proceeds/${lessonMonth}`)
  .then(result => callback(null, result), callback);
}
function fetchProceedsFromTo(
  lessonMonth,
  lastMonth,
  callback
) {
  alert(`/api/dev/admin/settlement/proceeds/${lessonMonth}/${lastMonth}`);
  axios.get(`/api/dev/admin/settlement/proceeds/${lessonMonth}/${lastMonth}`)
  .then(result => callback(null, result), callback);
}
function patchProceeds(
  lessonMonth,
  callback,
  refresh
) {
  const teachers = header.getAll();
  axios.post(`/api/dev/admin/settlement/proceeds/${lessonMonth}`, {
    teachers
  })
  .then(result => callback(null, result, refresh), callback);
}

function Records({
  teacherID
}) {
  return (
    <>
      <TableRow>
        <TableCell
          component="th"
          padding="none"
          size="small"
        >
          <Box
            display="block"
            style={{ width: '6em'}}
          >
            {teacherID}
          </Box>
        </TableCell>
        <TableCell
          component="th"
          padding="none"
          size="small"
        >
          <Box
            display="block"
            style={{ width: '8em'}}
          >
            {header.getDefaultValue(teacherID, 'teacherName')}
          </Box>
        </TableCell>
        <DeductionsField>
          {header.getDefaultValue(teacherID, 'totalPrice') - header.getDefaultValue(teacherID, 'totalRefundPrice')}
        </DeductionsField>
        <DeductionsField>
          {(header.getDefaultValue(teacherID, 'totalPrice') - header.getDefaultValue(teacherID, 'totalRefundPrice')) * 0.9}
        </DeductionsField>
        <DeductionsField>
          {(header.getDefaultValue(teacherID, 'totalPrice') - header.getDefaultValue(teacherID, 'totalRefundPrice')) * 0.3}
        </DeductionsField>
        <DeductionsField>
          {header.getDefaultValue(teacherID, 'totalStudent')}
        </DeductionsField>
        <TableCell
          size="small"
        />
        <ProceedField
          name="basic"
          teacherID={teacherID}
          visibleName="기본급"
        />
        <ProceedField
          name="taxable"
          teacherID={teacherID}
          visibleName="수당"
        />
        <ProceedField
          name="taxFree"
          teacherID={teacherID}
          visibleName="비과세"
        />
        <DeductionsField/>
        <TableCell
          size="small"
        />
        <DeductionsField
          name="NP"
          teacherID={teacherID}
        />
        <DeductionsField
          name="HI"
          teacherID={teacherID}
        />
        <DeductionsField
          name="LCI"
          teacherID={teacherID}
        />
        <DeductionsField
          name="EI"
          teacherID={teacherID}
        />
        <TableCell
          size="small"
        />
        <DeductionsField/>
        <DeductionsField/>
      </TableRow>
      <TableRow>
        <TableCell
          padding="none"
          size="small"
        >
          {header.getDefaultValue(teacherID, 'teacherJoined')}
        </TableCell>
        <TableCell
          padding="none"
          size="small"
        >
          {header.getDefaultValue(teacherID, 'teacherLeaved')}
        </TableCell>
        <DeductionsField/>
        <DeductionsField/>
        <DeductionsField/>
        <DeductionsField/>
        <TableCell
          size="small"
        />
        <DeductionsField/>
        <DeductionsField/>
        <DeductionsField/>
        <DeductionsField
          name="proceeds"
          teacherID={teacherID}
        />
        <TableCell
          size="small"
        />
        <DeductionsField
          name="IT"
          teacherID={teacherID}
        />
        <DeductionsField
          name="LIT"
          teacherID={teacherID}
        />
        <DeductionsField
          name="SAT"
          teacherID={teacherID}
        />
        <DeductionsField
          name="deductions"
          teacherID={teacherID}
        />
        <TableCell
          size="small"
        />
        <DeductionsField/>
        <DeductionsField>
          {header.getDefaultValue(teacherID, 'proceeds') - header.getDefaultValue(teacherID, 'deductions')}
        </DeductionsField>
      </TableRow>
    </>
  );


}


function DeductionsField({
  children,
  teacherID,
  name
}) {

  return (
    <TableCell
      padding="none"
      size="small"
    >
      <input
        disabled
        value={(children ? children : ((!(name) || (name === '')) ? null : header.getDefaultValue(teacherID, name)))}
        style={{ width: '100px' }}
      />
    </TableCell>
  );
}

function ProceedField({
  teacherID,
  name,
  visibleName
}) {
  const [ value, setValue ] = React.useState(header.getDefaultValue(teacherID, name));
  const setHeader = (e) => {
    const validateValue = e.target.value;
    let newValue = 0;
    // 0을 없애는 코드
    //if(/^0\d{1,}/.test(validateValue)) newValue = /^0(\d{1,})/.exec(validateValue)[1] - 0;
    // 음수 => 0으로 만드는 코드
    if(/^-\d/.test(validateValue)) newValue = 0
    // /^-(\d{1,})/.exec(validateValue)[1] - 0;
    // input value로 들어온 문자열을 숫자로 바꾸는 코드
    else if(/^\d/.test(validateValue)) newValue = validateValue - 0;
    // 소수점 제거 코드
    newValue = Math.floor(newValue);
    //alert(newValue);
    setValue(`${newValue}`);
    //header.setValue(name, newValue);
    header.setProceeds(teacherID, name, newValue);
  };
  return (
    <TableCell
      padding="none"
      size="small"
    >
      <input
        value={value}
        onChange={setHeader}
        step={10}
        style={{ width: '100px' }}
        type="number"
      />
      {/*
      <TextField
        autoComplete="no"
        label={visibleName}
        margin="normal"
        name={name}
        onChange={setHeader}
        size="small"
        type="number"
        value={value}
        variant="outlined"
      />
      <input
        disabled
        value={value}
        onChange={setHeader}
      />*/}
    </TableCell>
  );
}

export default ({

}) => {
  const setCount = React.useState(0)[1];
  const history = ReactRouter.useHistory();
  const location = ReactRouter.useLocation();
  const patchCallback = (err, result, refresh) => {
    if(err) {
      alert(err);
      return;
    }
    refresh();
    alert('간이세금계산이 완료되었습니다.');
  }
  React.useLayoutEffect(() => {
    dom = <>
      간이세금계산을 희망하는 달을 선택 후 조회를 눌러주세요.<br />
    </>;
    setCount(c => c+1);
    //const today = new Date();
    //const year = location.state?.year ?? today.getFullYear();
    //const month = location.state?.month ?? today.getMonth();
    /*
    history.replace({
      search: location.search,
      state: {
        mode: 'edit',
        year, month
      }
    });
    */
  }, []);
  const fetchFromTo = (
    year, month, eyear, emonth
  ) => {
    fetchProceedsFromTo(
      `${year}-${month}-01`,
      `${eyear}-${emonth}-01`,
      (err, result) => {
        if(err) {
          dom = err.toString();
          setCount(c => c+1);
          return;
        }
        const mapped = new Map(result.data.fetchedData.map(({ teacherID, ...rest }) => ([
          teacherID,
          rest
        ])));
        const list = Array.from(mapped.keys()).map(teacherID => (
          <Records
            teacherID={teacherID}
          />
        ));
        header.clear({}, mapped);
        dom = null;
        setCount(c => c+1);
        dom = (<>
          <After />
          <Page>
            <Box
              display="flex"
            >
              <Box
                mr={1}
              >
                <Button
                  color="primary"
                  size="small"
                  variant="text"
                >
                  예상 세금 정산
                </Button>
              </Box>
              <Box>
                <Button
                  color="primary"
                  disabled
                  size="small"
                  variant="text"
                >
                  이전 정산결과 조회
                </Button>
              </Box>
            </Box>
            <Deductions
              fields={null}
            />
          </Page>
          <TableContainer
            component={Page}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    padding="none"
                    size="small"
                    variant="head"
                    colspan="2"
                  >
                    인적사항
                  </TableCell>
                  <TableCell
                    align="center"
                    padding="none"
                    size="small"
                    variant="head"
                    colspan="4"
                  >
                    수업정보 및 공제요인
                  </TableCell>
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    align="center"
                    padding="none"
                    size="small"
                    variant="head"
                    colspan="4"
                  >
                    지급내역
                  </TableCell>
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    align="center"
                    padding="none"
                    size="small"
                    variant="head"
                    colspan="4"
                  >
                    공제내역 및 차인지급액
                  </TableCell>
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    align="center"
                    padding="none"
                    size="small"
                    variant="head"
                    colspan="2"
                  >
                    비고
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    사원번호
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    성명
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    교육비(세전)
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    교육비(세후)
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    급여액(30%)
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    학생수
                  </TableCell>
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    기본급
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    과세수당
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    비과세수당
                  </TableCell>
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    국민연금
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    건강보험
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    장기요양보험
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    고용보험
                  </TableCell>
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    size="small"
                    variant="head"
                  />
                </TableRow>
                <TableRow>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    입사일
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    퇴사일
                  </TableCell>
                  <TableCell
                    colspan={8}
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    지급합계
                  </TableCell>
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    소득세
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    지방소득세
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    농어촌특별세
                  </TableCell>
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    공제합계
                  </TableCell>
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    size="small"
                    variant="head"
                  />
                  <TableCell
                    padding="none"
                    size="small"
                    variant="head"
                  >
                    차인지급액
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list}
              </TableBody>
            </Table>
          </TableContainer>
        </>);
        setCount(c => c+1);
      }
    )
  }

  const fetchTo = (year, month, mode) => {
    fetchProceeds(`${year}-${month}-01`, (err, result) => {
      if(err) {
        dom = err.toString();
        setCount(c => c+1);
        return;
      }
      const mapped = new Map(result.data.fetchedData.map(({ teacherID, ...rest }) => ([
        teacherID,
        rest
      ])));
      const list = Array.from(mapped.keys()).map(teacherID => (
        <Records
          teacherID={teacherID}
        />
      ));
      header.clear({}, mapped);
      dom = null;
      setCount(c => c+1);
      dom = (<>
        <After />
        <Page>
          <Box
            display="flex"
          >
            <Box
              mr={1}
            >
              <Button
                color="primary"
                size="small"
                variant="text"
              >
                예상 세금 정산
              </Button>
            </Box>
            <Box>
              <Button
                color="primary"
                disabled
                size="small"
                variant="text"
              >
                이전 정산결과 조회
              </Button>
            </Box>
          </Box>
          <Deductions
            fields={null}
          />
        </Page>
        <TableContainer
          component={Page}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  padding="none"
                  size="small"
                  variant="head"
                  colspan="2"
                >
                  인적사항
                </TableCell>
                <TableCell
                  align="center"
                  padding="none"
                  size="small"
                  variant="head"
                  colspan="4"
                >
                  수업정보 및 공제요인
                </TableCell>
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  align="center"
                  padding="none"
                  size="small"
                  variant="head"
                  colspan="4"
                >
                  지급내역
                </TableCell>
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  align="center"
                  padding="none"
                  size="small"
                  variant="head"
                  colspan="4"
                >
                  공제내역 및 차인지급액
                </TableCell>
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  align="center"
                  padding="none"
                  size="small"
                  variant="head"
                  colspan="2"
                >
                  비고
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  사원번호
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  성명
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  교육비(세전)
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  교육비(세후)
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  급여액(30%)
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  학생수
                </TableCell>
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  기본급
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  과세수당
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  비과세수당
                </TableCell>
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  국민연금
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  건강보험
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  장기요양보험
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  고용보험
                </TableCell>
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  size="small"
                  variant="head"
                />
              </TableRow>
              <TableRow>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  입사일
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  퇴사일
                </TableCell>
                <TableCell
                  colspan={8}
                  size="small"
                  variant="head"
                />
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  지급합계
                </TableCell>
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  소득세
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  지방소득세
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  농어촌특별세
                </TableCell>
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  공제합계
                </TableCell>
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  size="small"
                  variant="head"
                />
                <TableCell
                  padding="none"
                  size="small"
                  variant="head"
                >
                  차인지급액
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          color="primary"
          onClick={e => patchProceeds(`${year}-${month}-01`, patchCallback, () => fetchTo(year, month))}
          variant="contained"
        >
          계산
        </Button>
      </>);
      setCount(c => c+1);
    });
  };
  return (<>
    <Page>
      <SelectingMonth fetchTo={fetchTo}/>
      <SelectingMonths fetchFromTo={fetchFromTo}/>
    </Page>
    {dom}
  </>);
};
