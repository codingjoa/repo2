import React from 'react';

export default list => {
  const origin = {};
  for(const obj of list) {
    origin[obj.studentID] = obj;
  };
  const state = {};
  return {
    goNext(callback) {
      const ov = [];
      let i = 0;
      for(const key in state) {
        const values = state[key];
        ov[i++] = {...origin[key], ...values};
      }
      callback(ov);
    },
    useHandlar(key, field, defaultValue) {
      const [ value, setValue ] = React.useState(defaultValue ?? '');
      if(!state[key]) state[key] = {};
      state[key][field] = value;
      return {
        value,
        onChange: e => {
          setValue(e.target.value);
        }
      };
    }
  };
}
