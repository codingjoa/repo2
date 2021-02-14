import axios from 'axios';

let examples = {};
function init() {
  axios.get('/api/admin/misc/refund')
  .then(r => {
alert(r?.data?.fetchedData);
    examples = r.data.fetchedData;
  })
  .catch(e => {
alert(e);
    examples = null;
  });
}
init();

export function getExamples() {
  return examples;
}
