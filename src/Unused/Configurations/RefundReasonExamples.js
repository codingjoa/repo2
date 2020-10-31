import React from 'react';
import axios from 'axios';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Page from '../../Templates/Page';
import Editor from './Editor';
import putCloser from './putCloser';
import deleteCloser from './deleteCloser';
function fetchExamples(
  callback
) {
  axios.get('/api/admin/misc/refund')
  .then(r => callback(null, r))
  .catch(callback);
}
function addExample(
  callback
) {
  axios.post('/api/admin/misc/refund')
  .then(r => callback(null, r))
  .catch(callback);
}
function AddQuestion(callback) {
  const r = window.confirm('새로운 환불 사유를 추가할까요?');
  if(!r) return;
  addExample(callback);
}

export default () => {
  const [ status, setStatus ] = React.useState(null);
  const [ examples, setExamples ] = React.useState(null);
  const fetchExamplesCallback = (err, result) => {
    if(err) {
      setStatus(err?.response?.status);
      return;
    }
    setStatus(200);
    setExamples(result.data.fetchedData);
  }
  const putCallback = (err, result) => {
    if(err) {
      alert(`${err?.response?.status}: ${err}`);
      return;
    }
    setStatus(null);
  };
  React.useLayoutEffect(() => {
    if(status === null) fetchExamples(fetchExamplesCallback);
  }, [ status ]);
  return (
    <>
      <Typography variant="subtitle1">
        환불 사유 예시 관리
      </Typography>
      <Page>
        {status === 404 && <>환불 사유 예시가 없습니다.</>}
        {status === 200 && examples && examples.map(({ editID, refundReason }) => <>
        <Editor
          callEdit={putCloser(`/api/admin/misc/refund/${editID}`, {}, putCallback, true)}
          callDelete={deleteCloser(`/api/admin/misc/refund/${editID}`, putCallback)}
          text={refundReason}
          field="refundReason"
          question="사유 예시를"
        />
        </>)}
        <Link onClick={e => AddQuestion(putCallback)}>추가</Link>
      </Page>
    </>
  );
}
