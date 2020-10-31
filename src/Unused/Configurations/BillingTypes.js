import React from 'react';
import axios from 'axios';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';
import Editor from './Editor';
import putCloser from './putCloser';

function fetchAll(
  callback
) {
  Promise.all([
    axios.get('/api/admin/misc/billing'),
    axios.get('/api/admin/misc/salary')
  ])
  .then(r => callback(null, r))
  .catch(callback);
}

export default () => {
  const [ status, setStatus ] = React.useState(null);
  const [ billingTypes, setBillingTypes ] = React.useState(null);
  const [ salary, setSalary ] = React.useState(null);
  

  const fetchAllCallback = (err, result) => {
    if(err) {
      setStatus(err?.response?.status);
      return;
    }
    const [ billingTypes, salary ] = result;
    const bt = [[], []];
    for(const { billingPayment, billingPrice, billingGroup } of billingTypes.data.fetchedData) {
      bt[billingPayment-0][billingGroup-0] = billingPrice;
    }
    setStatus(200);
    setBillingTypes(bt);
    setSalary(salary.data.fetchedData);
  }
  const putCallback = (err, result) => {
    if(err) {
      alert(`${err?.response?.status}: ${err}`);
      return;
    }
    setStatus(null);
  };
  React.useLayoutEffect(() => {
    if(status === null) fetchAll(fetchAllCallback);
  }, [ status ]);
  return (
    <>
      <Typography variant="subtitle1">
        비용 설정
      </Typography>
      <Page>
        {status === 200 && <>
        <Editor
          callEdit={putCloser('/api/admin/misc/billing', { billingPayment: 0, billingGroup: 0}, putCallback, true)}
          label="현금/개인 레슨"
          text={billingTypes && billingTypes[0][0]}
          field="billingPrice"
          suffix="원"
        />
        <Editor
          callEdit={putCloser('/api/admin/misc/billing', { billingPayment: 0, billingGroup: 1}, putCallback, true)}
          label="현금/그룹 레슨(2인 이상)"
          text={billingTypes && billingTypes[0][1]}
          field="billingPrice"
          suffix="원"
        />
        <Editor
          callEdit={putCloser('/api/admin/misc/billing', { billingPayment: 0, billingGroup: 2}, putCallback, true)}
          label="현금/그룹 레슨(5인 이상)"
          text={billingTypes && billingTypes[0][2]}
          field="billingPrice"
          suffix="원"
        />
        <Editor
          callEdit={putCloser('/api/admin/misc/billing', { billingPayment: 1, billingGroup: 0}, putCallback, true)}
          label="카드/그룹 레슨(2인 이상)"
          text={billingTypes && billingTypes[1][0]}
          field="billingPrice"
          suffix="원"
        />
        <Editor
          callEdit={putCloser('/api/admin/misc/billing', { billingPayment: 1, billingGroup: 1}, putCallback, true)}
          label="카드/그룹 레슨(5인 이상)"
          text={billingTypes && billingTypes[1][1]}
          field="billingPrice"
          suffix="원"
        />
        <Editor
          callEdit={putCloser('/api/admin/misc/billing', { billingPayment: 1, billingGroup: 2}, putCallback, true)}
          label="카드/개인 레슨"
          text={billingTypes && billingTypes[1][2]}
          field="billingPrice"
          suffix="원"
        />
        <Editor
          callEdit={putCloser('/api/admin/misc/salary', { ID: salary ? salary[0].ID : 0 }, putCallback, true)}
          label={salary && salary[0].Tag}
          text={salary && salary[0].Price}
          field="Price"
          suffix="원"
        />

        </>}
      </Page>
    </>
  );
}
