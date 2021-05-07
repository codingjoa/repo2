import React from 'react';
const today = new Date();
function toDateString() {
  const reg = /(\d{4}-\d{2}-\d{2})T/;
  const json = JSON.stringify({ today });
  //const json = today.toJSON();
  if(reg.test(json) === null) return null;
  return reg.exec(json)[1];
}

export default (validateFunction) => {
  const values = {
    teacherOp: 0,
    isForeigner: 0,
    teacherJoined: toDateString(),
    teacherID: ''
  };
  const helperLabels = {};
  const handleHelper = (key, value) => {
    helperLabels[key](value);
  };
  return {
    getValues(callback) {
      callback(values);
    },
    useHandlar(key) {
      const [ value, setValue ] = React.useState(values[key] ?? null);
      const [ helperText, setHelperText ] = React.useState(null);
      values[key] = value;
      helperLabels[key] = setHelperText;
      React.useLayoutEffect(() => {
        validateFunction(values, handleHelper);
      }, [ value ]);
      return {
        value,
        helperText,
        onChange: e => {
          setValue(e.target.value);
        }
      };
    },
    useHandlarCheckbox(key) {
      const [ checked, setChecked ] = React.useState(values[key]===1 ? 1 : 0);
      values[key] = checked;
      return {
        checked,
        onChange: e => {
          if(checked===1) {
            setChecked(0);
          }
          else if(checked===0) {
            setChecked(1);
          }
        }
      }
    }
  };
}
