import React from 'react';
const today = new Date();
function toDateString() {
  const reg = /(\d{4}-\d{2}-\d{2})T/;
  const json = JSON.stringify({ today });
  //const json = today.toJSON();
  if(reg.test(json) === null) return null;
  return reg.exec(json)[1];
}

export default (
  validateFunction = () => {},
  defaultValues = {},
) => {
  const values = defaultValues;
  const helperLabels = {};
  const handleHelper = (key, value) => {
    helperLabels[key](value);
  };
  return {
    getValues(callback) {
      callback(values);
    },
    useHandlar(key,
      protectFunction = (r => r)
    ) {
      const [ value, setValue ] = React.useState((values ? values[key] : null) ?? null);
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
          // protectFunction은 사용자의 잘못된 입력을 방지하기 위해
          // 매개변수를 조정하여 반환값으로 바꿔줍니다.
          // 예시로 소수점 차단, 음수 입력 차단 등에 사용할 수 있습니다.
          setValue(protectFunction(e.target.value));
        }
      };
    },
    useHandlarCheckbox(key) {
      const [ value, setValue ] = React.useState((values ? values[key] : false) ?? false);
      values[key] = value;
      return {
        checked: value,
        onChange: e => {
          setValue(value => !value);
          //setValue(e.target.checked);
          //values[key] = e.target.checked===true ? 1 : undefined;
        }
      }
    },
    values
  };
}
