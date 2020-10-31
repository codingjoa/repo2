import React from 'react';

export default (validateFunction) => {
  const values = {};
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
    }
  };
}
