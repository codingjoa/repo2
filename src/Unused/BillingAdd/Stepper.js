import React, { useContext } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import { Context } from './Context';
const steps = ['학생 선택', '반 선택', '금액/기간 등록'];

export default function() {
  const { step } = useContext(Context);
  return(
    <Stepper activeStep={step}>
      {steps.map(label => 
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      )}
    </Stepper>
  );
}

