
export default idChain => {
  const state = {};
  const origin = {};
  for(const { studentID, ...rest } of idChain) {
    origin[studentID] = rest;
  }
  return {
    getTargets(callback) {
      const iter = [];
      let i = 0;
      for(const key in state) {
        if(state[key])
          iter[i++] = {
            studentID: key,
            studentName: origin[key]?.studentName,
            billingPrice: origin[key]?.billingPrice,
          };
      }
      callback(iter);
    },
    reset() {
      state = {};
    },
    useHandlar(key) {
      return {
        onChange: e => {
          state[key] = e.target.checked===true ? true : undefined;
        }
      };
    }
  };
}
