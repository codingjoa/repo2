import React from 'react';
import Typography from '@material-ui/core/Typography';

let dom = null;

const Forms = ({

})=> (<>
  <Typography
    variant="subtitle1"
  >
    세율 등록
  </Typography>
  <Typography
    variant="subtitle1"
  >
    선생별 수당 등록
  </Typography>
</>);
const After = ({

}) => {
  return (<>
    <Forms />
  </>);
};
export default ({
  
}) => {
  React.useLayoutEffect(() => {
    dom = (<>
      <After />
    </>);
  }, []);
  return dom;
};
