import React from 'react';
import * as ReactRouter from 'react-router-dom';
import SelectingMonth from './SelectingMonth';
import Typography from '@material-ui/core/Typography';
let dom = null;
let render = 0;
const After = ({
  param
}) => (<>
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
export default ({
  
}) => {
  const [ count, setCount ] = React.useState(0);
  const history = ReactRouter.useHistory();
  const location = ReactRouter.useLocation();
  React.useLayoutEffect(() => {
    dom = (<>
      메인렌더링횟수({++render})
      메인카운트({count})
      <SelectingMonth />
      <After />
    </>);
    if(!location.state?.sm) {
      
    }
    const today = new Date();
    const sm = {
      year: today.getFullYear(),
      month: today.getMonth()
    };
    history.replace({
      state: {
        sm
      }
    });
    //setCount(c => c+1);
  }, []);
  return (<>{dom}</>);
};
