import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Link from '@material-ui/core/Link';
import Page from '../../Templates/Page';
import Stepper from './Stepper';
import SelectingStudent from './SelectingStudent';
import SelectingQuarter from './SelectingQuarter';
import SelectingBillingPrice from './SelectingBillingPrice';
import Question from './Question';
import { Context } from './Context';
function fetchAll(callback) {
  Promise.all([
    axios.get('/api/admin/student'),
    axios.get('/api/admin/quarter')
//    axios.get('/api/admin/misc/billing')
  ])
  .then(r => callback(null, r))
  .catch(callback);
}
function fetchAvailable(callback, { studentID, quarterID }) {
  axios.get(`/api/admin/billing/available/${studentID}/${quarterID}`)
  .then(r => callback(null, r))
  .catch(callback);
}
function posting(callback, { params, body }) {
  const { studentID, quarterID } = params;
  alert(params);
  alert(body);
/*
  axios.post(`/api/admin/billing/${studentID}/${quarterID}`, {...body})
  .then(r => callback(null, r))
  .catch(callback);
*/
}
function handleMonth(lessonMonth, state) {
  checked[lessonMonth] = state ? true : undefined;
}
function handleMonthReset() {
  for(const lessonMonth in checked)
    checked[lessonMonth] = undefined;
}
const checked = {};

export default function() {
  const [ step, setStep ] = React.useState(0);
  const [ pickedStudent, setPickedStudent ] = React.useState(null);
  const [ pickedQuarter, setPickedQuarter ] = React.useState(null);
  const [ pickedPayment, setPickedPayment ] = React.useState(0);
  const [ pickedGroup, setPickedGroup ] = React.useState(0);
  const [ price, setPrice ] = React.useState(0);
  const [ status, setStatus ] = React.useState(null);
  const [ quarters, setQuarters ] = React.useState(null);
  const [ students, setStudents ] = React.useState(null);
  const [ billingTypes, setBillingTypes ] = React.useState(null);
  const [ available, setAvailable ] = React.useState(null);

  const history = useHistory();

  const handleState = (err, result) => {
    if(err) {
      setStatus(err?.response?.status ?? 1);
      return
    }
    const [ students, quarters, billingTypes ] = result;
    setStudents(students.data.fetchedData);
    setQuarters(quarters.data.fetchedData);
/*
    const bt = [[], []];
    for(const { billingPayment, billingPrice, billingGroup } of billingTypes.data.fetchedData) {
      bt[billingPayment-0][billingGroup-0] = billingPrice;
    }
    setBillingTypes(bt);
    setPrice(bt[0][0]);
*/
    setPrice(0);
    setStatus(200);
  };
  React.useLayoutEffect(() => {
    fetchAll(handleState);
  }, []);
  const handleAvailable = (err, result) => {
    if(err) {
      alert('정보를 불러오는 데 실패했습니다. 다시 시도해주세요.');
      return;
    }
    setAvailable(result.data.fetchedData);
  };
  React.useLayoutEffect(() => {
    pickedStudent && pickedQuarter && fetchAvailable(handleAvailable, { studentID: pickedStudent, quarterID: pickedQuarter });
  }, [ pickedStudent, pickedQuarter]);
  React.useLayoutEffect(() => {
    step === 2 && handleMonthReset();
    step === 2 && setPickedPayment(0);
    step === 2 && setPickedGroup(0);
    step === 2 && setPrice(0);
  }, [ step ]);
  const handleNext = () => {
    setStep(preStep => preStep + 1);
  };
  const handleBack = () => {
    setStep(preStep => preStep - 1);
  };
  const pickStudent = student => {
    setPickedStudent(student);
    setStep(1);
  };
  const pickQuarter = quarter => {
    setPickedQuarter(quarter);
    setStep(2);
  };
  const handlePriceAutomatic = () => {
    billingTypes && !pickedPayment && !pickedGroup && setPrice(billingTypes[0][0]);
    billingTypes && setPrice(billingTypes[pickedPayment][pickedGroup]);
  };
  const handlePayment = e => {
    setPickedPayment(prePayment => prePayment ? 0 : 1);
  };
  const handleGroup = e => {
    setPickedGroup(e.target.value - 0);
  };
  const handlePrice = e => {
    if(/^0\d{1,}/.test(e.target.value)) setPrice(/^0(\d{1,})/.exec(e.target.value)[1]);
    else if(/^\d/.test(e.target.value)) setPrice(e.target.value - 0);
    else setPrice(0);
  };
  const getResult = () => {
    const lessonMonth = [];
    for(const lm in checked) {
      lessonMonth.push(lm);
    }
    return {
      params: {
        studentID: pickedStudent,
        quarterID: pickedQuarter
      },
      body: {
        lessonMonth,
        billingPayment: pickedPayment,
        billingGroup: pickedGroup,
        billingPrice: price
      }
    }
  };
  const handleComplete = (err, result) => {
    if(err) {
      alert('작업 실패, 나중에 다시 시도하십시오');
      return;
    }
    history.push('/admin/billing');
  };
  const handleSubmit = e => {
    posting(handleComplete, getResult());
  };
  //React.useLayoutEffect(handlePriceAutomatic, [ billingTypes, pickedPayment, pickedGroup ]);

  return (
    <Context.Provider
      value={{
        step, billingTypes,
        /* 학생 선택 */
        pickStudent,
        /* 반 선택 */
        pickQuarter,
        /* 요금/기간 선택 */
        handleMonth, handlePayment,
        handleGroup, pickedGroup,
        price, handlePrice, getResult, handleNext,
        handleBack, handleSubmit
      }}
    >
      { status === 404 || status === 400 && <>오류</> }
      { status === 200 && 
      <>
        <Page>
          <Stepper />
        </Page>
        {step === 0 ? <SelectingStudent list={students} /> : null}
        {step === 1 ? <SelectingQuarter list={quarters} /> : null}
        {step === 2 && available && <SelectingBillingPrice available={available} />}
        {step === 3 &&
          <Question />
        }
        {step > 0 && step < 3 && <Link color="primary" onClick={handleBack}>뒤로</Link>}
      </>
      }
    </Context.Provider>
  );

}
