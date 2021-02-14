import React from 'react';
import axios from 'axios';

export default (initialValues, validateFunction) => {
  const refs = {};
  const refsReturn = () => {
    const ov = {};
    for(const key in refs) {
      ov[key] = refs[key].current.value;
    }
    return ov;
  };

  return {
    postCloser(pathname, callback) {
      return () => {
        const ov = {};
        for(const key in refs) {
          ov[key] = refs[key].current.value;
        }
        axios.post(pathname, ov)
        .then(r => callback(null, r))
        .catch(callback);
      };
    },
    useHandlar(key) {
      const [ value, setValue ] = React.useState(initialValues[key]);
      const [ helperText, setHelperText ] = React.useState(null);
      const inputRef = React.useRef(null);
      React.useLayoutEffect(() => {
        validateFunction(refsReturn());
      }, [ value ]);
      refs[key] = inputRef;
      return {
        value,
        defaultValue: initialValues[key],
        helperText,
        inputRef,
        onBlur: e => {
//          setHelperText(value === initialValues[key] ? '처음과 똑같아요' : '달라졌군요!');
        },
        onChange: e => {
          setValue(e.target.value);
        }
      };
    }
  };
}
