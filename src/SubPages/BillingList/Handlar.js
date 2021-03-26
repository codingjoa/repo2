import React from 'react';

export default (validateFunction, callback, effect) => {
  const values = {};
  const helperLabels = {};
  const handleHelper = (key, value) => {
    helperLabels[key](value);
  };
  return {
    useState(id, name) {
      const [ checked, setChecked ] = React.useState(false);
      const [ quarterID, setQuarterID ] = React.useState(null);
      const [ billingGroup, setBillingGroup ] = React.useState(0);
      const [ billingPayment, setBillingPayment ] = React.useState(0);
      const [ billingPrice, setBillingPrice ] = React.useState(0);
      const [ billingScholarshipCode, setBillingScholarshipCode ] = React.useState(false);
      const [ billingTaxCode, setBillingTaxCode ] = React.useState(false);
      values[id] = {
        name,
        checked,
        quarterID,
        billingGroup,
        billingPayment,
        billingPrice,
        billingScholarshipCode,
        billingTaxCode
      };
      React.useLayoutEffect(() => {
        let checklen = 0;
        for(const studentID in values) {
          const { checked, quarterID } = values[studentID];
          if(!checked) continue;
          checklen++;
          if(quarterID !== null) continue;
          return effect(false);
        }
        if(checklen<=0) return effect(false);
        effect(true);
      }, [ checked, quarterID ]);
      return {
        checkbox: {
          checked,
          onChange: e => {
            setChecked(!checked)
            //!checked ? checklen++ : checklen--;
            //checklen === 0 ? setDisabled(true) : setDisabled(false);
          }
        },
        quarter: {
          value: quarterID,
          onChange: e => {
            setQuarterID(e.target.value)
          }
        },
        group: {
          value: billingGroup,
          onChange: e => {
            setBillingGroup(e.target.value)
          }
        },
        payment: {
          value: billingPayment,
          onChange: e => {
            setBillingPayment(e.target.value)
          }
        },
        price: {
          value: billingPrice,
          onChange: e => {
            if(/^0\d{1,}/.test(e.target.value)) setBillingPrice(/^0(\d{1,})/.exec(e.target.value)[1]);
            else if(/^\d/.test(e.target.value)) setBillingPrice(e.target.value - 0);
            else setBillingPrice(0);
          }
        },
        billingScholarshipCode: {
          value: billingScholarshipCode,
          onChange: e => {
            setBillingScholarshipCode(!billingScholarshipCode)
          }
        },
        billingTaxCode: {
          value: billingTaxCode,
          onChange: e => {
            setBillingTaxCode(!billingTaxCode)
          }
        }
      }
    },
    handleSubmit() {
      const av = [];
      let i = 0;
      for(const studentID in values) {
        if(values[studentID].checked) {
          if(values[studentID].quarterID === null) {
            return callback(`${values[studentID].name} 학생의 반이 선택되지 않았습니다.`);
          }
          av[i++] = {
            studentID,
            ...values[studentID]
          };
        }
      }
      if(i === 0) callback('입금을 등록할 학생을 선택하세요.');
      else callback(null, av);
    },
    putCloser(pathname, callback, isPatch) {
/*
      return () => {
        (isPatch ? axios.patch(pathname, ov) : axios.put(pathname, ov))
        .then(r => callback(null, r))
        .catch(callback);
      };
*/
    },
    getValues(callback) {

    },
    useHandlar(key) {
      const [ value, setValue ] = React.useState(null);
      const [ helperText, setHelperText ] = React.useState(null);
      values[key] = value;
      helperLabels[key] = setHelperText;
      React.useLayoutEffect(() => {
        if(value != null) validateFunction(values, handleHelper);
      }, [ value ]);
      return {
        value,
        helperText,
        onChange: e => {
          setValue(e.target.value);
        }
      };
    }
  };
}
