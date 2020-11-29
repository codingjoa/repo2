import React from 'react';

export default (validateFunction) => {
  const values = {
    teacherOp: 0
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
      const [ value, setValue ] = React.useState(null);
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
      return {
        onChange: e => {
          values[key] = e.target.checked===true ? 1 : 0;
        }
      }
    }
  };
}
